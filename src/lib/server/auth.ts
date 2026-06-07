import { cookies } from 'next/headers';

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || !sessionCookie.value) {
        throw new Error('Unauthorized: No session cookie');
    }

    const idToken = sessionCookie.value;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!apiKey) {
        throw new Error('Internal Server Error: Missing Firebase API Key');
    }

    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        const data = await response.json();

        if (!response.ok || !data.users || data.users.length === 0) {
            throw new Error('Unauthorized: Invalid token');
        }

        return data.users[0];
    } catch (error) {
        console.error("verifyAdmin error:", error);
        throw new Error('Unauthorized');
    }
}
