import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebaseToken');

  if (!token?.value) {
    throw new Error('Unauthorized');
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('Firebase API Key not configured');
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token.value }),
  });

  if (!res.ok) {
    throw new Error('Unauthorized');
  }
}
