import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page stack">
      <div className="card stack">
        <span className="pill">Restaurant QR Ordering Starter</span>
        <h1 style={{ margin: 0 }}>Table-based ordering system</h1>
        <p className="small">
          Customer scans a QR code, orders food and drinks, adds special notes, calls a waiter, sees a live bill,
          and pays online. Admin sees table-wise orders and payment status.
        </p>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <Link className="btn" href="/menu/t1">Open demo customer page</Link>
          <Link className="btn secondary" href="/admin">Open demo admin panel</Link>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Customer flow</h3>
          <p className="small">Scan QR → browse menu → place order → order more → call waiter → pay.</p>
        </div>
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Admin flow</h3>
          <p className="small">Live table totals, order queue, service requests, and payment updates.</p>
        </div>
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Backend</h3>
          <p className="small">Next.js route handlers + Supabase + Razorpay placeholders.</p>
        </div>
      </div>
    </main>
  );
}
