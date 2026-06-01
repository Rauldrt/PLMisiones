import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    throw new Error('Unauthorized: Missing auth token');
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('Server error: Missing Firebase API Key');
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token })
  });

  if (!res.ok) {
    throw new Error('Unauthorized: Invalid or expired token');
  }

  const data = await res.json();
  if (!data.users || data.users.length === 0) {
     throw new Error('Unauthorized: User not found');
  }

  return data.users[0];
}
