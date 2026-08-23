'use server';

import { revalidatePath } from 'next/cache';
import type { FormSubmission, WhatsappConfig } from '@/lib/types';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';
import * as admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const isFirebaseConfigured = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let adminDb: any = null;

function getAdminDb() {
  if (typeof process === 'undefined' || !process.env.FIREBASE_SERVICE_ACCOUNT) {
    return null;
  }
  
  if (!adminDb) {
    try {
      if (getApps().length === 0) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(serviceAccount),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'partido-libertario-mns.firebasestorage.app'
        });
      }
      adminDb = getFirestore('pl-misiones');
    } catch (err) {
      console.error("Failed to initialize Firebase Admin DB in submissions:", err);
      return null;
    }
  }
  return adminDb;
}

// Global variable for local in-memory config fallback
let localWhatsappConfig: WhatsappConfig = {
  enabled: false,
  provider: 'callmebot',
  apiKey: '',
  numbers: '',
  webhookUrl: '',
};

// ----------------------------------------------------
// Whatsapp Configuration Actions
// ----------------------------------------------------
export async function getWhatsappConfigAction(): Promise<WhatsappConfig> {
  if (isFirebaseConfigured) {
    try {
      const adminDbInstance = getAdminDb();
      if (adminDbInstance) {
        const docSnap = await adminDbInstance.collection('settings').doc('whatsapp_config').get();
        if (docSnap.exists) {
          return docSnap.data() as WhatsappConfig;
        }
      } else {
        const db = getFirestoreDb();
        const docRef = doc(db, 'settings', 'whatsapp_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as WhatsappConfig;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch WhatsappConfig from Firestore:", err);
    }
  }

  // Fallback to local JSON file
  try {
    const fullPath = path.join(process.cwd(), 'src/data/whatsapp-config.json');
    const data = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(data) as WhatsappConfig;
  } catch (err) {
    return localWhatsappConfig;
  }
}

export async function saveWhatsappConfigAction(config: WhatsappConfig) {
  let firestoreSuccess = false;
  if (isFirebaseConfigured) {
    try {
      const adminDbInstance = getAdminDb();
      if (adminDbInstance) {
        await adminDbInstance.collection('settings').doc('whatsapp_config').set(config);
      } else {
        const db = getFirestoreDb();
        const docRef = doc(db, 'settings', 'whatsapp_config');
        await setDoc(docRef, config);
      }
      firestoreSuccess = true;
    } catch (err) {
      console.error("Failed to save WhatsappConfig in Firestore:", err);
    }
  } else {
    localWhatsappConfig = config;
  }

  // Save to local JSON file
  try {
    const fullPath = path.join(process.cwd(), 'src/data/whatsapp-config.json');
    await fs.writeFile(fullPath, JSON.stringify(config, null, 2));
  } catch (fsError) {
    if (!firestoreSuccess) throw fsError;
  }

  revalidatePath('/admin/submissions');
  revalidatePath('/admin/manage-google-forms');
  return { success: true, message: 'Configuración de WhatsApp guardada con éxito.' };
}

export async function getGreenApiQrAction(instanceId: string, token: string) {
  try {
    const url = `https://api.green-api.com/waInstance${instanceId}/qr/${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { success: false, message: `Error de API: ${res.statusText}` };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error de conexión.' };
  }
}

export async function getGreenApiStatusAction(instanceId: string, token: string) {
  try {
    const url = `https://api.green-api.com/waInstance${instanceId}/getStateInstance/${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { success: false, message: `Error de API: ${res.statusText}` };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error de conexión.' };
  }
}

// Helper: Send WhatsApp notification via API fetch
async function sendWhatsappNotification(config: WhatsappConfig, submission: FormSubmission) {
  if (!config.enabled) return;

  const formNames = {
    contacto: 'Contacto',
    afiliacion: 'Pre-Afiliación',
    fiscales: 'Fiscales de Mesa',
    test_libertario: 'Test de Aptitud Libertaria'
  };

  const text = `*Partido Libertario Misiones*\nNueva solicitud de *${formNames[submission.type] || submission.type}*:\n\n` +
    Object.entries(submission.data)
      .map(([key, val]) => {
        const labels: Record<string, string> = {
          name: 'Nombre y Apellido',
          dni: 'DNI',
          email: 'Email',
          phone: 'Teléfono / WhatsApp',
          locality: 'Localidad',
          score: 'Resultado del Test',
          pilar_vida: 'Pilar: La Vida',
          pilar_libertad: 'Pilar: La Libertad',
          pilar_propiedad: 'Pilar: Propiedad Privada',
          pilar_estado: 'Pilar: Rol del Estado',
          address: 'Domicilio',
          occupation: 'Profesión',
          subject: 'Asunto',
          message: 'Mensaje',
          electoralSection: 'Escuela/Sección',
          availability: 'Disponibilidad',
          comments: 'Comentarios'
        };
        let formattedVal = String(val);
        if (key === 'availability') {
          formattedVal = val === 'full_day' ? 'Jornada Completa' : val === 'morning' ? 'Mañana' : 'Tarde';
        }
        return `- *${labels[key] || key}*: ${formattedVal}`;
      })
      .join('\n') +
    `\n\nVer panel: https://www.partidolibertariomisiones.org/admin/submissions`;

  try {
    if (config.provider === 'telegram' && config.telegramToken && config.telegramChatId) {
      const url = `https://api.telegram.org/bot${config.telegramToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.telegramChatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
      if (!res.ok) {
        console.error("Telegram notification failed:", res.statusText);
      }
    } else if (config.provider === 'discord' && config.webhookUrl) {
      const discordText = text.replace(/\*/g, '**');
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: discordText
        })
      });
      if (!res.ok) {
        console.error("Discord notification failed:", res.statusText);
      }
    } else if (config.provider === 'webhook' && config.webhookUrl) {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          type: submission.type,
          data: submission.data,
          createdAt: submission.createdAt
        })
      });
      if (!res.ok) {
        console.error(`Webhook notification failed:`, res.statusText);
      }
    } else if (config.provider === 'greenapi' && config.greenApiInstanceId && config.greenApiToken && config.numbers) {
      const numberList = config.numbers.split(',').map(n => n.trim());
      for (const number of numberList) {
        if (!number) continue;
        const cleanNumber = number.replace(/[+\s-]/g, '');
        const chatId = `${cleanNumber}@c.us`;
        const url = `https://api.green-api.com/waInstance${config.greenApiInstanceId}/sendMessage/${config.greenApiToken}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: chatId,
            message: text
          })
        });
        if (!res.ok) {
          console.error(`Green-API notification failed for number ${number}:`, res.statusText);
        }
      }
    } else if (config.provider === 'callmebot' && config.apiKey && config.numbers) {
      const numberList = config.numbers.split(',').map(n => n.trim());
      for (const number of numberList) {
        if (!number) continue;
        const cleanNumber = number.replace(/[+\s-]/g, '');
        const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanNumber}&text=${encodeURIComponent(text)}&apikey=${config.apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`CallMeBot notification failed for number ${number}:`, res.statusText);
        }
      }
    }
  } catch (err) {
    console.error(`Error sending notification via ${config.provider}:`, err);
  }
}

// ----------------------------------------------------
// Submissions Actions
// ----------------------------------------------------
let localSubmissions: FormSubmission[] = [];

export async function submitFormAction(
  type: FormSubmission['type'],
  data: Record<string, any>
) {
  const id = crypto.randomUUID();
  const submission: FormSubmission = {
    id,
    type,
    data,
    status: 'pending',
    createdAt: new Date().toISOString(),
    read: false, // Default to unread!
  };

  if (isFirebaseConfigured) {
    try {
      const adminDbInstance = getAdminDb();
      if (adminDbInstance) {
        const { id: _, ...cleanSubmission } = submission;
        await adminDbInstance.collection('submissions').doc(id).set(cleanSubmission);
      } else {
        const db = getFirestoreDb();
        const docRef = doc(db, 'submissions', id);
        const { id: _, ...cleanSubmission } = submission;
        await setDoc(docRef, cleanSubmission);
      }
    } catch (err) {
      console.error('Error saving submission in Firestore:', err);
      return { success: false, message: 'Hubo un error de conexión con la base de datos.' };
    }
  } else {
    localSubmissions.push(submission);
  }

  // Asynchronously send WhatsApp notification
  try {
    const waConfig = await getWhatsappConfigAction();
    if (waConfig && waConfig.enabled) {
      // Don't await here to keep client response fast
      sendWhatsappNotification(waConfig, submission).catch(err => 
        console.error("WhatsApp notification background error:", err)
      );
    }
  } catch (waError) {
    console.error("Failed to load WhatsApp config on submit:", waError);
  }

  revalidatePath('/admin/submissions');
  return { success: true, message: '¡Formulario enviado con éxito!' };
}

export async function getSubmissionsAction(): Promise<FormSubmission[]> {
  if (!isFirebaseConfigured) {
    return [...localSubmissions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  try {
    const adminDbInstance = getAdminDb();
    if (adminDbInstance) {
      const snapshot = await adminDbInstance.collection('submissions').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as FormSubmission[];
    } else {
      const db = getFirestoreDb();
      const colRef = collection(db, 'submissions');
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FormSubmission[];
      return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return [];
  }
}

export async function updateSubmissionStatusAction(
  id: string,
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
) {
  if (isFirebaseConfigured) {
    try {
      const adminDbInstance = getAdminDb();
      if (adminDbInstance) {
        await adminDbInstance.collection('submissions').doc(id).update({ status });
      } else {
        const db = getFirestoreDb();
        const docRef = doc(db, 'submissions', id);
        await setDoc(docRef, { status }, { merge: true });
      }
    } catch (err) {
      console.error('Error updating submission status:', err);
      return { success: false, message: 'Error al actualizar el estado.' };
    }
  } else {
    const index = localSubmissions.findIndex(s => s.id === id);
    if (index !== -1 && localSubmissions[index]) {
      localSubmissions[index].status = status;
    }
  }

  revalidatePath('/admin/submissions');
  return { success: true, message: 'Estado actualizado correctamente.' };
}

export async function markSubmissionReadAction(id: string, read: boolean) {
  if (isFirebaseConfigured) {
    try {
      const adminDbInstance = getAdminDb();
      if (adminDbInstance) {
        await adminDbInstance.collection('submissions').doc(id).update({ read });
      } else {
        const db = getFirestoreDb();
        const docRef = doc(db, 'submissions', id);
        await setDoc(docRef, { read }, { merge: true });
      }
    } catch (err) {
      console.error('Error marking submission as read:', err);
      return { success: false, message: 'Error al actualizar estado de lectura.' };
    }
  } else {
    const index = localSubmissions.findIndex(s => s.id === id);
    if (index !== -1 && localSubmissions[index]) {
      localSubmissions[index].read = read;
    }
  }

  revalidatePath('/admin/submissions');
  return { success: true, message: 'Estado de lectura actualizado.' };
}

export async function deleteSubmissionAction(id: string) {
  if (isFirebaseConfigured) {
    try {
      const adminDbInstance = getAdminDb();
      if (adminDbInstance) {
        await adminDbInstance.collection('submissions').doc(id).delete();
      } else {
        const db = getFirestoreDb();
        const docRef = doc(db, 'submissions', id);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      return { success: false, message: 'Error al eliminar el registro.' };
    }
  } else {
    localSubmissions = localSubmissions.filter(s => s.id !== id);
  }

  revalidatePath('/admin/submissions');
  return { success: true, message: 'Registro eliminado con éxito.' };
}
