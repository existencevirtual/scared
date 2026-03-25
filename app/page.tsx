'use client';

import { useState } from 'react';

export default function Home() {
  const [secretText, setSecretText] = useState('');
  const [ttl, setTtl] = useState('60');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretText, ttl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const url = `${window.location.origin}/s/${data.id}#${data.key}`;
      setShareUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setSecretText('');
    setShareUrl('');
    setCopied(false);
    setError('');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Scared</h1>
          <p className="text-gray-400 mt-2 text-lg">Share secrets that self-destruct after being read.</p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {!shareUrl ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Secret</label>
                <textarea
                  value={secretText}
                  onChange={e => setSecretText(e.target.value)}
                  placeholder="Type your secret here... passwords, keys, private notes..."
                  className="w-full h-36 bg-gray-800/80 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                  required
                  maxLength={10000}
                />
                <p className="text-xs text-gray-500 mt-1">{secretText.length} / 10,000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expires after</label>
                <select
                  value={ttl}
                  onChange={e => setTtl(e.target.value)}
                  className="w-full bg-gray-800/80 border border-gray-600/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="15">15 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">1 day</option>
                  <option value="10080">7 days</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !secretText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Encrypting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Create Secret Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Secret Created!</h2>
                <p className="text-gray-400 text-sm mt-1">Share this link — it can only be opened once.</p>
              </div>

              <div className="bg-gray-800/60 border border-gray-600/40 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Secret Link</p>
                <p className="text-indigo-300 text-sm break-all font-mono leading-relaxed">{shareUrl}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 text-sm"
                >
                  New Secret
                </button>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                <p className="text-amber-400 text-xs flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  This link will stop working after it is opened once. Make sure to share it securely.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          {[
            { icon: '🔐', title: 'AES-256', desc: 'Military-grade encryption' },
            { icon: '💣', title: 'Self-Destruct', desc: 'Gone after first view' },
            { icon: '⏱️', title: 'Auto-Expire', desc: 'Set your own TTL' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-4">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-white text-xs font-semibold">{f.title}</div>
              <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
