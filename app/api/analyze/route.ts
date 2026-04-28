import { webSearch } from "@/lib/webSearch";
import { analyzeCompany } from "@/lib/analyzer";
import { addClient } from "@/lib/store";

export async function POST(req: Request) {
  const { name } = await req.json();

  const text = await webSearch(name);
  const result = analyzeCompany(text);

  const client = {
    name,
    ...result
  };

  addClient(client);

  return Response.json(client);
}
