import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token?.value) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: token.value,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.users || data.users.length === 0) {
    throw new Error('Unauthorized');
  }

  return true;
}
