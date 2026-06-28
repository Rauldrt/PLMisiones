import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('Server configuration error');
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  if (!data.users || data.users.length === 0) {
    throw new Error('Unauthorized');
  }

  return data.users[0];
}
