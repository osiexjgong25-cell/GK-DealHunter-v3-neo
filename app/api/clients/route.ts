export const runtime = "nodejs";

import { getClients } from "../../../lib/store";

export async function GET() {
  return Response.json(getClients());
}
