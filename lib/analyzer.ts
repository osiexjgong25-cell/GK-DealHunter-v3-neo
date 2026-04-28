export function analyzeCompany(text: string) {
  let score = 0;
  let type = "股权";

  const rules = [
    { keys: ["融资","投资","扩张","IPO","增长","营收"], score: 20, type: "股权" },

    { keys: ["贷款","负债","现金流","应收账款","资金周转"], score: 25, type: "债权" },

    { keys: ["裁员","破产","资金链断裂","清算","爆雷","倒闭"], score: 40, type: "短拆" },

    { keys: ["转型","重组","出售","剥离","管理层变动"], score: 30, type: "机会" }
  ];

  for (const r of rules) {
    for (const k of r.keys) {
      if (text.includes(k)) {
        score += r.score;
        type = r.type;
      }
    }
  }

  return {
    type,
    score,
    level: score > 80 ? "S" : score > 50 ? "A" : "B"
  };
}
