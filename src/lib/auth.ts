'use server';

import 'dotenv/config';

// This is a mock authentication check.
// In a real production environment, use a secure method like
// Firebase Authentication, and store secrets in a secure way
// (e.g., Google Secret Manager or .env.local).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'libertad';

export async function checkPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}
