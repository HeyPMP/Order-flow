import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature');
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ ok: false, error: 'Missing webhook signature or secret' }, { status: 400 });
  }

  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (expected !== signature) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook signature' }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event as string;
  const paymentEntity = payload.payload?.payment?.entity;

  if (event === 'payment.captured' && paymentEntity && supabaseAdmin) {
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'paid',
        gateway_payment_id: paymentEntity.id,
        paid_at: new Date().toISOString()
      })
      .eq('gateway_order_id', paymentEntity.order_id);
  }

  return NextResponse.json({ ok: true });
}
