'use client';
import { AuthProviderComponent } from '@/context/AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}
