'use client';

import { useState } from 'react';
import { demoOrders } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';

const statusOptions = ['new', 'accepted', 'preparing', 'served', 'paid'] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState(demoOrders);

  function updateStatus(orderId: string, status: (typeof statusOptions)[number]) {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
  }

  const tableTotals = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.tableSlug] = (acc[order.tableSlug] || 0) + order.total;
    return acc;
  }, {});

  return (
    <div className="stack">
      <div className="grid grid-3">
        {Object.entries(tableTotals).map(([tableSlug, total]) => (
          <div className="card" key={tableSlug}>
            <div className="small">Table</div>
            <h2 style={{ margin: '6px 0' }}>{tableSlug.toUpperCase()}</h2>
            <strong>{formatCurrency(total)}</strong>
          </div>
        ))}
      </div>

      <div className="card stack">
        <div className="row">
          <h2 style={{ margin: 0 }}>Live orders</h2>
          <span className="pill">Demo data</span>
        </div>

        {orders.map((order) => (
          <div className="card stack" key={order.id}>
            <div className="row">
              <div>
                <strong>Table {order.tableSlug.toUpperCase()}</strong>
                <div className="small">{new Date(order.createdAt).toLocaleString('en-IN')}</div>
              </div>
              <span className="badge">{order.status}</span>
            </div>

            <div className="stack">
              {order.items.map((item) => (
                <div className="row" key={`${order.id}-${item.itemId}`}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {order.note ? <div className="small">Special note: {order.note}</div> : null}

            <div className="row" style={{ flexWrap: 'wrap' }}>
              <strong>Total: {formatCurrency(order.total)}</strong>
              <div className="row" style={{ flexWrap: 'wrap' }}>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className="btn secondary"
                    onClick={() => updateStatus(order.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
