
'use server';

import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseApp as getClientFirebaseApp } from '@/lib/firebase/client';

// Use client app for writes from client-side actions if ever needed,
// but for server actions, admin is better.
const clientDb = getFirestore(getClientFirebaseApp());

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
