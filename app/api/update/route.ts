export const runtime = "nodejs";

import { updateStatus } from "lib/store";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    updateStatus(id, status);

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "update failed" });
  }
}