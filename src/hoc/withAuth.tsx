
'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="space-y-4 w-1/2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-2/3" />
            </div>
         </div>
      );
    }

    return <Component {...props} />;
  };
}
