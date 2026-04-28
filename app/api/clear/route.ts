// app/api/clear/route.ts
import { clearClients } from "../../../lib/store";

export async function POST() {
  clearClients();
  return Response.json({ success: true });
}
