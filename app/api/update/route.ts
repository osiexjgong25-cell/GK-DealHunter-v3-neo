// app/api/update/route.ts
import { NextResponse } from 'next/server';
import { updateClientStatus } from '../../../lib/store';

// 接收 ID 和目标 status
export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // 调用 store 层更改状态
    updateClientStatus(id, status);

    return NextResponse.json({ ok: true, message: 'Status updated' });
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
