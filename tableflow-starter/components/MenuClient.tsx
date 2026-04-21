'use client';

import { useMemo, useState } from 'react';
import type { CartItem, MenuItem, ServiceRequestType } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function MenuClient({
  tableSlug,
  menuItems,
  sessionId = 'demo-session'
}: {
  tableSlug: string;
  menuItems: MenuItem[];
  sessionId?: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const grouped = useMemo(() => {
    return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.itemId === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.itemId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }

      return [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }

  function updateQty(itemId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.itemId === itemId ? { ...entry, quantity: Math.max(0, entry.quantity + delta) } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }

  async function placeOrder() {
    if (!cart.length) {
      setMessage('Add at least one item before placing an order.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableSlug, sessionId, note, items: cart })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to place order');

      setMessage('Order sent successfully. Admin can now see it.');
      setCart([]);
      setNote('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function createServiceRequest(type: ServiceRequestType) {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableSlug, sessionId, type })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to send request');
      setMessage(`Request sent: ${type.replace('_', ' ')}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function createPayment() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, tableSlug, amount: total })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment init failed');

      setMessage(
        `Payment order created. Hook this to Razorpay checkout next. Demo order id: ${data.gatewayOrderId}`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-2">
      <div className="stack">
        <div className="card stack">
          <div className="row">
            <div>
              <div className="small">Customer page</div>
              <h1 style={{ margin: '4px 0' }}>Table {tableSlug.toUpperCase()}</h1>
            </div>
            <span className="pill">Session: {sessionId}</span>
          </div>
          <p className="small">Scan QR, place order, add notes, call waiter, and pay online.</p>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div className="card stack" key={category}>
            <h2 style={{ margin: 0 }}>{category}</h2>
            <div className="grid grid-2">
              {items.map((item) => (
                <div className="menuItem card" key={item.id}>
                  <div className="stack">
                    <div className="row">
                      <h3>{item.name}</h3>
                      <strong>{formatCurrency(item.price)}</strong>
                    </div>
                    <p>{item.description}</p>
                    <button className="btn" onClick={() => addToCart(item)} disabled={!item.available}>
                      {item.available ? 'Add to cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="stack">
        <div className="card stack">
          <h2 style={{ margin: 0 }}>Cart</h2>
          {cart.length === 0 ? <p className="small">No items yet.</p> : null}
          {cart.map((item) => (
            <div className="row" key={item.itemId}>
              <div>
                <strong>{item.name}</strong>
                <div className="small">{formatCurrency(item.price)} each</div>
              </div>
              <div className="row">
                <button className="btn secondary" onClick={() => updateQty(item.itemId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button className="btn secondary" onClick={() => updateQty(item.itemId, 1)}>+</button>
              </div>
            </div>
          ))}

          <div>
            <label className="small">Special instructions</label>
            <textarea
              className="textarea"
              placeholder="Less spicy, no onion, extra ice..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="row">
            <strong>Total</strong>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <button className="btn" onClick={placeOrder} disabled={loading}>
            {loading ? 'Please wait...' : 'Place order'}
          </button>
        </div>

        <div className="card stack">
          <h2 style={{ margin: 0 }}>Waiter / service</h2>
          <div className="grid grid-2">
            <button className="btn secondary" onClick={() => createServiceRequest('waiter')}>Call waiter</button>
            <button className="btn secondary" onClick={() => createServiceRequest('need_bill')}>Need bill</button>
            <button className="btn secondary" onClick={() => createServiceRequest('water')}>Water</button>
            <button className="btn secondary" onClick={() => createServiceRequest('assistance')}>Assistance</button>
          </div>
        </div>

        <div className="card stack">
          <h2 style={{ margin: 0 }}>Payment</h2>
          <p className="small">This starter creates a Razorpay order on the backend. Then connect Checkout on the frontend.</p>
          <button className="btn success" onClick={createPayment} disabled={loading || total <= 0}>
            Pay now
          </button>
        </div>

        {message ? <div className="card"><p style={{ margin: 0 }}>{message}</p></div> : null}
      </div>
    </div>
  );
}
