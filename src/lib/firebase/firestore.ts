
'use server';

import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { getFirebaseApp } from '@/lib/firebase/client';
import type { FormSubmission } from '../types';

// Initialize Firestore
const db = getFirestore(getFirebaseApp());

/**
 * Saves a form submission to a specified Firestore collection.
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
    const docRef = await addDoc(collection(db, collectionName), submissionData);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving submission to collection ${collectionName}:`, error);
    throw new Error('Could not save submission to the database.');
  }
}

/**
 * Retrieves all submissions from a specified Firestore collection.
 * @param collectionName The name of the collection.
 * @returns An array of form submissions.
 */
export async function getSubmissions(collectionName: string): Promise<FormSubmission[]> {
  try {
    const q = query(collection(db, collectionName), orderBy('submittedAt', 'desc'));
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
