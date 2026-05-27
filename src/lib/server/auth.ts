import { cookies } from 'next/headers';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebaseToken')?.value;

  if (!token) {
    throw new Error('No autorizado: Token no encontrado.');
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('Configuración de Firebase incompleta.');
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    throw new Error('No autorizado: Token inválido o expirado.');
  }

  return true;
}
