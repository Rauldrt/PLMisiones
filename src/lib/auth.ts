'use server';

// This is a mock authentication check.
// In a real production environment, use a secure method like
// Firebase Authentication, and store secrets in a secure way
// (e.g., Google Secret Manager or .env.local).

// Next.js automatically loads .env.local into process.env on the server.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'libertad';

export async function checkPassword(password: string): Promise<boolean> {
  // This log will appear in the server terminal, not the browser console.
  console.log(`[AuthCheck] Comparing with password: ${ADMIN_PASSWORD}`);
  return password === ADMIN_PASSWORD;
}
