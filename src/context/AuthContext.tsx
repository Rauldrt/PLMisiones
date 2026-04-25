
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onIdTokenChanged, getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase/client';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(getFirebaseApp());
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; secure; samesite=strict`;
      } else {
        document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    if (pathname.startsWith('/admin')) {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
