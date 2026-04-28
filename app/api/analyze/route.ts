export const runtime = "nodejs";

import { smartSearch } from "../../../lib/search";
import { analyzeCompany } from "../../../lib/analyzer";
import { addClient } from "../../../lib/store";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const { text, source } = await smartSearch(name);
    const result = analyzeCompany(text);

    const client = {
      name,
      source,
      ...result
    };

    addClient(client);

    return Response.json(client);
  } catch (e) {
    return Response.json({ error: "analyze failed" });
  }
}
