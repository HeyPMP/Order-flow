import { NextResponse } from 'next/server';
import { getRazorpayInstance } from '@/lib/razorpay';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, tableSlug, amount } = body;

  if (!sessionId || !tableSlug || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({
      ok: true,
      mode: 'demo',
      gatewayOrderId: `demo_order_${Date.now()}`,
      amount
    });
  }

  const razorpay = getRazorpayInstance();
  const gatewayOrder = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    notes: { sessionId, tableSlug }
  });

  if (supabaseAdmin) {
    await supabaseAdmin.from('payments').insert({
      session_id: sessionId,
      table_slug: tableSlug,
      amount,
      status: 'created',
      gateway_order_id: gatewayOrder.id,
      method: 'online'
    });
  }

  return NextResponse.json({
    ok: true,
    gatewayOrderId: gatewayOrder.id,
    amount: gatewayOrder.amount / 100,
    keyId: process.env.RAZORPAY_KEY_ID
  });
}
