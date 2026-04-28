// app/api/clear/route.ts
export const runtime = "nodejs";
import { clearClients } from "../../../lib/store"; // ✅ 名字改成 clearClients

export async function POST() {
  try {
    clearClients(); // ✅ 调用正确的方法名
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Clear failed" }), {
      status: 500
    });
  }
}
