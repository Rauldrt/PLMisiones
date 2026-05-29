import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    throw new Error('Unauthorized');
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
      throw new Error('Firebase API key not configured');
  }

  // Verify token using Firebase Auth REST API (prevents needing firebase-admin module)
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: session })
  });

  const data = await res.json();
  if (data.error || !data.users || data.users.length === 0) {
    throw new Error('Unauthorized');
  }
}
