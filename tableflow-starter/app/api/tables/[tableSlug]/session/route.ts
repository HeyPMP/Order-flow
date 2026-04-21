import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tableSlug: string }> }
) {
  const { tableSlug } = await params;

  return NextResponse.json({
    sessionId: `session-${tableSlug}`,
    tableSlug,
    status: 'active'
  });
}
