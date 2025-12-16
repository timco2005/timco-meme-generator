'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';

export default function HomePage() {
  const router = useRouter();
  const { user } = db.useAuth();

  useEffect(() => {
    if (user) {
      router.push('/feed');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="loading-container">
      <div className="loading-spinner">Loading...</div>
    </div>
  );
}

