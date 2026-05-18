import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: sessionCookie })
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  if (!data.users || data.users.length === 0) {
    throw new Error('Unauthorized');
  }

  return true;
}
