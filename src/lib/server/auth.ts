import { cookies } from 'next/headers';

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return false;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
        console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
        return false;
    }
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.users && data.users.length > 0;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}
