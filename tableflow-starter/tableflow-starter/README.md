# TableFlow Starter

A starter Next.js web app for a restaurant QR ordering system.

## What is included
- Customer table page: `/menu/t1`
- Admin page: `/admin`
- Order API route
- Service request API route
- Razorpay order creation and webhook placeholders
- Supabase SQL schema

## Stack
- Next.js App Router
- TypeScript
- Supabase
- Razorpay

## Run in VS Code
1. Open this folder in VS Code.
2. Open terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open `http://localhost:3000`

## Environment variables
Copy `.env.example` to `.env.local` and fill in your keys.

```bash
cp .env.example .env.local
```

## Supabase setup
1. Create a Supabase project.
2. Open the SQL editor.
3. Paste everything from `supabase/schema.sql` and run it.
4. Add your project URL and keys in `.env.local`.

## Razorpay setup
This starter already has:
- backend route to create an order
- backend route to verify payment signature
- webhook route for payment status

To complete the flow, connect the frontend button to Razorpay Checkout and then call `/api/payments/verify` after success.

## Recommended next steps
- Add authentication for admin users.
- Replace demo menu with data from Supabase.
- Add realtime updates with Supabase Realtime.
- Add a kitchen screen.
- Add tax and service charge rules.
- Add true session lookup from the QR table.

## Suggested folder structure

```text
app/
  admin/
  api/
  menu/[tableSlug]/
components/
lib/
supabase/
```
