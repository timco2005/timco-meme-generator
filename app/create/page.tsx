'use client';

import AuthGuard from '@/components/AuthGuard';
import MemeEditor from '@/components/MemeEditor';
import { db } from '@/lib/db';

export default function CreatePage() {
  const { user } = db.useAuth();

  return (
    <AuthGuard>
      <div className="create-page">
        {user && <MemeEditor userId={user.id} />}
      </div>
    </AuthGuard>
  );
}

