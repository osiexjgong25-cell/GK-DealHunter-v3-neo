export const runtime = "nodejs";
import { clearAll } from "@/lib/store";

export async function POST() {
  clearAll();
  return Response.json({ ok: true });
}
