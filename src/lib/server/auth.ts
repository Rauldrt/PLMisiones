import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });

  const data = await res.json();
  if (data.error || !data.users || data.users.length === 0) {
    throw new Error('Unauthorized: Invalid token');
  }

  return data.users[0];
}
