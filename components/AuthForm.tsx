'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await db.auth.sendMagicCode({ email });
      setStep('code');
    } catch (err: any) {
      setError(err.body?.message || 'Failed to send magic code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err: any) {
      setError(err.body?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <div className="form-group">
              <label htmlFor="code">Magic Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter the code sent to your email"
                required
                disabled={loading}
                maxLength={6}
              />
              <p className="form-hint">Check your email for the magic code</p>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                }}
                disabled={loading}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

