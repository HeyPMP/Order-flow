import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { tableSlug, sessionId, type } = body;

  if (!tableSlug || !sessionId || !type) {
    return NextResponse.json({ error: 'Missing request data' }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true, mode: 'demo', request: { tableSlug, sessionId, type } });
  }

  const { data, error } = await supabaseAdmin
    .from('service_requests')
    .insert({
      table_slug: tableSlug,
      session_id: sessionId,
      request_type: type,
      status: 'new'
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, request: data });
}
