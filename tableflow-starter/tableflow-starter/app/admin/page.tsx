import AdminOrders from '@/components/AdminOrders';

export default function AdminPage() {
  return (
    <main className="page stack">
      <div className="card stack">
        <span className="pill">Admin dashboard</span>
        <h1 style={{ margin: 0 }}>Restaurant control panel</h1>
        <p className="small">View incoming table orders, running totals, status updates, and payment state.</p>
      </div>

      <AdminOrders />
    </main>
  );
}
