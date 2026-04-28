export const runtime = "nodejs";

import { clearAll } from "../../../lib/store";

export async function POST() {
  try {
    clearAll();
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "clear failed" });
  }
}
