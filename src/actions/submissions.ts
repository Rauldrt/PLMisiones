'use server';

import { revalidatePath } from 'next/cache';
import type { FormSubmission } from '@/lib/types';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';
import * as admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

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

// In-memory fallback for local dev if firebase is not available
let localSubmissions: FormSubmission[] = [];

export async function submitFormAction(
  type: 'contacto' | 'afiliacion' | 'fiscales',
  data: Record<string, any>
) {
  const id = crypto.randomUUID();
  const submission: FormSubmission = {
    id,
    type,
    data,
    status: 'pending',
    createdAt: new Date().toISOString(),
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
