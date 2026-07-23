
'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_ADMIN_AUTH === 'true';

    useEffect(() => {
      if (!isAuthDisabled && !loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router, isAuthDisabled]);

    if (isAuthDisabled) {
      return <Component {...props} />;
    }

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
    
    if (user) {
      return <Component {...props} />;
    }

    return null;
  };
}
