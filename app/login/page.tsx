'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const { user } = db.useAuth();

  useEffect(() => {
    if (user) {
      router.push('/feed');
    }
  }, [user, router]);

  return (
    <div className="login-page">
      <AuthForm />
    </div>
  );
}

