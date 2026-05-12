import { cookies } from 'next/headers';

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    if (!sessionCookie) throw new Error('Unauthorized: No session token');

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) throw new Error('Firebase API key missing');

    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: sessionCookie }),
    });

    if (!res.ok) {
        throw new Error('Unauthorized: Invalid token');
    }

    const data = await res.json();
    if (!data.users || data.users.length === 0) {
        throw new Error('Unauthorized: User not found');
    }
}
