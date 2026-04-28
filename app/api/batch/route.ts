import { webSearch } from "@/lib/webSearch";
import { analyzeCompany } from "@/lib/analyzer";
import { addClient } from "@/lib/store";

export async function POST(req: Request) {
  const { list } = await req.json();

  const results = await Promise.all(
    list.map(async (name: string) => {
      const text = await webSearch(name);
      const result = analyzeCompany(text);

      const client = {
        id: Date.now().toString() + Math.random(),
        name,
        ...result,
        status: "未联系"
      };

      addClient(client);

      return client;
    })
  );

  return Response.json(results);
}
