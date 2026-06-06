import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: session }),
    });

    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message || 'Invalid token');
    }

    if (!data.users || data.users.length === 0) {
        throw new Error('User not found');
    }

    return data.users[0];
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
