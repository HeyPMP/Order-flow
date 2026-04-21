import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { tableSlug, sessionId, items, note } = body;

  if (!tableSlug || !sessionId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
  }

  const total = items.reduce((sum: number, item: { price: number; quantity: number }) => {
    return sum + item.price * item.quantity;
  }, 0);

  if (!supabaseAdmin) {
    return NextResponse.json({
      ok: true,
      mode: 'demo',
      order: {
        id: crypto.randomUUID(),
        tableSlug,
        sessionId,
        total,
        note,
        status: 'new'
      }
    });
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      session_id: sessionId,
      table_slug: tableSlug,
      status: 'new',
      total_amount: total,
      special_note: note ?? null
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 });
  }

  const orderItems = items.map((item: { itemId: string; quantity: number; price: number }) => ({
    order_id: order.id,
    menu_item_id: item.itemId,
    quantity: item.quantity,
    item_price: item.price
  }));

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, order });
}
