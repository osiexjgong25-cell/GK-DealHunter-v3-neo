export const runtime = "nodejs";
import { clearClients } from "../../../lib/store"; // 这里的名字必须叫 clearClients

export async function POST() {
  try {
    clearClients(); 
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
