import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
    throw new Error('Internal Server Error');
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token,
      }),
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    if (!data.users || data.users.length === 0) {
      throw new Error('User not found');
    }

    // We could add role checking here later if needed
    return data.users[0];
  } catch (error) {
    console.error('Error verifying admin token:', error);
    throw new Error('Unauthorized');
  }
}
