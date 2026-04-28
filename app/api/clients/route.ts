import { getClients } from "@/lib/store";

export async function GET() {
  return Response.json(getClients());
}
