# Scared 🔐

> Share secrets that self-destruct after being read.

Scared is a secure, open-source one-time secret sharing service. Send passwords, API keys, private notes, or any sensitive information through links that are permanently destroyed after a single view.

## Features

- 🔐 **AES-256-GCM encryption** — Military-grade encryption with authenticated encryption
- 💣 **Self-destructing links** — Secrets are permanently deleted after the first view
- ⏱️ **Auto-expiry** — Set TTL from 15 minutes to 7 days
- 🔑 **Zero-knowledge design** — Decryption key only exists in the URL fragment (never sent to server)
- 🚀 **No sign-up required** — Just create and share

## How It Works

1. You type a secret and choose an expiry time
2. The secret is encrypted with AES-256-GCM on the server
3. You get a shareable link with the decryption key in the URL `#fragment`
4. The recipient clicks the link and reveals the secret — destroying it forever
5. The decryption key fragment is never sent to the server (browser security)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 14](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- Node.js `crypto` — AES-256-GCM encryption (no external deps)

## Production Deployment

For production, replace the in-memory store in `lib/secrets.ts` with Redis or another persistent store.

```bash
npm run build
npm start
```

## License

MIT
