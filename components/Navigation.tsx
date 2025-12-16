'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = db.useAuth();

  const handleLogout = async () => {
    await db.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <Image src="/logo.svg" alt="TIMCO Logo" width={40} height={40} />
          <span className="nav-title">TIMCO CREATIVE GROUP</span>
        </Link>
        <div className="nav-links">
          <Link
            href="/create"
            className={`nav-link ${pathname === '/create' ? 'active' : ''}`}
          >
            Create Meme
          </Link>
          <Link
            href="/feed"
            className={`nav-link ${pathname === '/feed' ? 'active' : ''}`}
          >
            Feed
          </Link>
          {user ? (
            <>
              <span className="nav-user">{user.email}</span>
              <button className="nav-link btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

