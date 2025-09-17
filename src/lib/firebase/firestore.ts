
'use server';

import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { getFirebaseApp as getClientFirebaseApp } from '@/lib/firebase/client';
import { getFirebaseAdminApp } from '@/lib/firebase/admin';
import type { FormSubmission } from '../types';

// Use client app for writes from client-side actions if ever needed,
// but for server actions, admin is better.
const clientDb = getFirestore(getClientFirebaseApp());

// Use Admin SDK for server-side reads/writes to bypass security rules
const adminDb = getFirestore(getFirebaseAdminApp());


/**
 * Saves a form submission to a specified Firestore collection.
 * This function can be called from Server Actions.
 * @param collectionName The name of the collection (e.g., 'submissions-afiliacion').
 * @param data The form data to save.
 * @returns The ID of the newly created document.
 */
export async function saveSubmission(collectionName: string, data: Record<string, any>): Promise<string> {
  try {
    const submissionData = {
      ...data,
      submittedAt: serverTimestamp(),
    };
    // Use the clientDb because this action is triggered by unauthenticated users.
    // The Firestore rules allow this 'create' operation.
    const docRef = await addDoc(collection(clientDb, collectionName), submissionData);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving submission to collection ${collectionName}:`, error);
    throw new Error('Could not save submission to the database.');
  }
}

/**
 * Retrieves all submissions from a specified Firestore collection using the Admin SDK.
 * This is meant to be called from secured server-side functions (e.g., in the admin panel).
 * @param collectionName The name of the collection.
 * @returns An array of form submissions.
 */
export async function getSubmissions(collectionName: string): Promise<FormSubmission[]> {
  try {
    // Use the adminDb to read data, bypassing client-side security rules.
    // This assumes this function is only called from trusted server environments.
    const q = query(collection(adminDb, collectionName), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const submissions: FormSubmission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp to ISO string for serialization
      const submittedAt = data.submittedAt?.toDate()?.toISOString() ?? new Date().toISOString();
      
      submissions.push({
        id: doc.id,
        ...data,
        submittedAt,
      });
    });

    return submissions;
  } catch (error) {
    console.error(`Error fetching submissions from collection ${collectionName}:`, error);
    // In case of error (e.g., permissions), return an empty array.
    return [];
  }
}
