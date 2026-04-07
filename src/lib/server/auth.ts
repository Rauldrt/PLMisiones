import { cookies } from 'next/headers';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin App
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    throw new Error('Unauthorized: No session cookie provided.');
  }

  try {
    // Verify the session cookie
    const decodedClaims = await admin.auth().verifyIdToken(sessionCookie);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying admin session:', error);
    throw new Error('Unauthorized: Invalid session.');
  }
}
