export const runtime = "nodejs";
import { updateStatus } from "@/lib/store";

export async function POST(req: Request) {
  const { id, status } = await req.json();

  updateStatus(id, status);

  return Response.json({ ok: true });
}
