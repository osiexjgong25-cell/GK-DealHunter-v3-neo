export const runtime = "nodejs";

import { smartSearch } from "lib/search";
import { analyzeCompany } from "lib/analyzer";
import { addClient } from "lib/store";

export async function POST(req: Request) {
  try {
    const { list } = await req.json();

    const results = await Promise.all(
      list.map(async (name: string) => {
        const { text, source } = await smartSearch(name);
        const result = analyzeCompany(text);

        const client = {
          id: Date.now().toString() + Math.random(),
          name,
          source,
          ...result,
          status: "未联系"
        };

        addClient(client);
        return client;
      })
    );

    return Response.json(results);
  } catch (e) {
    return Response.json({ error: "batch failed" });
  }
}