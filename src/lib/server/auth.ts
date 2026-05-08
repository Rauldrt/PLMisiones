import { cookies } from 'next/headers';

export async function verifyAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie || !sessionCookie.value) {
    throw new Error('Unauthorized: No session cookie found');
  }

  const token = sessionCookie.value;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error('Server Configuration Error: Missing Firebase API Key');
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });

    if (!response.ok) {
      throw new Error('Unauthorized: Invalid session token');
    }

    const data = await response.json();
    if (!data.users || data.users.length === 0) {
      throw new Error('Unauthorized: User not found');
    }
  } catch (error) {
    console.error('Admin verification failed:', error);
    throw new Error('Unauthorized: Admin verification failed');
  }
}
