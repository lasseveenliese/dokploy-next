This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The UI is built with [shadcn/ui](https://ui.shadcn.com) components and uses [Lucide Icons](https://lucide.dev) for iconography.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

This template ships with a `.env.example` file that documents environment variables. Copy it to `.env` and fill in values as needed.

For SMTP mail delivery with Nodemailer, set:

- `SMTP_HOST`
- `SMTP_PORT` (for example `587` or `465`)
- `SMTP_SECURE` (`true` or `false`; if empty it defaults to `true` for port `465`)
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL` (default sender address)
- `SMTP_FROM_NAME` (optional default sender name)

When `SMTP_SECURE=false`, the mail utility requires STARTTLS for secure transport.

Mail sending is available through `sendEmail` in `lib/email.ts` (server-side only).  
`from` is optional and defaults to `SMTP_FROM_EMAIL`, but can be overridden per mail.

## Docker Compose

Mit `docker-compose.yml` kannst du die App lokal im Container starten:

```bash
docker compose up --build
```

Danach ist die App unter [http://localhost:3000](http://localhost:3000) erreichbar.

Zum Stoppen und Aufraeumen:

```bash
docker compose down
```

## Docker Image (GHCR)

Ein Docker Image wird automatisch nach `ghcr.io` veröffentlicht, wenn du einen Git-Tag im Format `v*` (z.B. `v1.2.3`) pushst.

Der Git-Tag wird auch als Image Tag verwendet. Das letzte Image erhält auch immer den Tag `latest`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Standalone Deployment (z.B. Plesk)

Dieses Projekt ist auf `output: 'standalone'` konfiguriert. Next.js erzeugt dabei `.next/standalone/server.js`, aber kopiert standardmäßig **nicht** automatisch `public/` und `.next/static/` in den Standalone-Ordner. Das übernimmt `npm run build` via `postbuild`.

Empfohlen:

```bash
npm ci
npm run build
node .next/standalone/server.js
```

Konfiguration (typisch, z.B. Plesk):

- Application root: Projekt-Root (wo `package.json` liegt)
- Startup file: `.next/standalone/server.js`
