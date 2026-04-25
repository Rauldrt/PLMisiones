import { cookies } from 'next/headers';

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session');

    if (!sessionCookie || !sessionCookie.value) {
        throw new Error('No autorizado. Sesión no encontrada.');
    }

    // Securely verify the Firebase ID token using the Identity Toolkit API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
        throw new Error('Error de configuración del servidor.');
    }

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: sessionCookie.value })
    });

    if (!response.ok) {
        throw new Error('No autorizado. Sesión inválida o expirada.');
    }

    return true;
}
