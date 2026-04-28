export async function smartSearch(name: string) {
  const query = `${name} 融资 投资 裁员 资金链 贷款 财务`;

  // ======================
  // 🟢 SERPER（优先）
  // ======================
  try {
    if (process.env.SERPER_API_KEY) {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: query })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.organic?.map((i: any) => i.snippet).join(" ");
        if (text) return { source: "serper", text };
      }
    }
  } catch (e) {}

  // ======================
  // 🟡 TAVILY
  // ======================
  try {
    if (process.env.TAVILY_API_KEY) {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.results?.map((i: any) => i.content).join(" ");
        if (text) return { source: "tavily", text };
      }
    }
  } catch (e) {}

  // ======================
  // 🔵 FALLBACK（绝对不崩）
  // ======================
  return {
    source: "fallback",
    text: `${name} 融资 投资 贷款 裁员 资金链 经营情况 风险`
  };
}
