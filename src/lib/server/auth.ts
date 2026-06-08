import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebaseIdToken')?.value;

  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) throw new Error('Firebase API Key is not configured');

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    const data = await response.json();

    if (!response.ok || !data.users || data.users.length === 0) {
      throw new Error('Unauthorized: Invalid token');
    }

    return data.users[0];
  } catch (error) {
    console.error('Admin verification failed:', error);
    throw new Error('Unauthorized');
  }
}
