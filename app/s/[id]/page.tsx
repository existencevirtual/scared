'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Status = 'checking' | 'ready' | 'loading' | 'revealed' | 'gone' | 'invalid-link';

export default function SecretPage() {
  const params = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status>('checking');
  const [secret, setSecret] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`/api/secrets/${params.id}`);
        const data = await res.json();
        setStatus(data.exists ? 'ready' : 'gone');
      } catch {
        setStatus('gone');
      }
    }
    check();
  }, [params.id]);

  async function handleReveal() {
    setStatus('loading');
    try {
      const key = window.location.hash.slice(1);
      if (!key) { setStatus('invalid-link'); return; }
      const res = await fetch(`/api/secrets/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('gone'); return; }
      setSecret(data.secret);
      setStatus('revealed');
    } catch {
      setStatus('gone');
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
            <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Scared</h1>
          <p className="text-gray-400 mt-1">Someone shared a secret with you</p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {status === 'checking' && (
            <div className="text-center py-8">
              <svg className="animate-spin w-8 h-8 text-indigo-400 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="text-gray-400 mt-3">Checking secret...</p>
            </div>
          )}

          {status === 'ready' && (
            <div className="space-y-6 text-center">
              <div>
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="text-xl font-semibold text-white">A secret awaits</h2>
                <p className="text-gray-400 text-sm mt-2">
                  This secret will be <span className="text-red-400 font-medium">permanently destroyed</span> after you view it. There is no going back.
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                <p className="text-amber-400 text-xs">⚠️ Only open this if you are the intended recipient. Once revealed, the secret is gone forever.</p>
              </div>
              <button
                onClick={handleReveal}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Reveal Secret
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center py-8">
              <svg className="animate-spin w-8 h-8 text-indigo-400 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="text-gray-400 mt-3">Decrypting...</p>
            </div>
          )}

          {status === 'revealed' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-3">🔓</div>
                <h2 className="text-lg font-semibold text-white">Secret Revealed</h2>
                <p className="text-gray-500 text-xs mt-1">This secret has been destroyed and cannot be accessed again.</p>
              </div>
              <div className="bg-gray-800/60 border border-gray-600/40 rounded-xl p-4">
                <p className="text-white text-sm whitespace-pre-wrap break-words font-mono leading-relaxed">{secret}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 text-sm text-center"
                >
                  Create Your Own
                </Link>
              </div>
            </div>
          )}

          {status === 'gone' && (
            <div className="space-y-6 text-center">
              <div>
                <div className="text-5xl mb-4">💨</div>
                <h2 className="text-xl font-semibold text-white">Secret Not Found</h2>
                <p className="text-gray-400 text-sm mt-2">
                  This secret has already been viewed, has expired, or the link is invalid.
                </p>
              </div>
              <Link
                href="/"
                className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 text-center"
              >
                Create a New Secret
              </Link>
            </div>
          )}

          {status === 'invalid-link' && (
            <div className="space-y-6 text-center">
              <div>
                <div className="text-5xl mb-4">🔗</div>
                <h2 className="text-xl font-semibold text-white">Incomplete Link</h2>
                <p className="text-gray-400 text-sm mt-2">
                  The link you followed is missing the decryption key. Make sure you copied the full URL including the <code className="text-indigo-400">#key</code> part at the end.
                </p>
              </div>
              <Link
                href="/"
                className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 text-center"
              >
                Create a New Secret
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
