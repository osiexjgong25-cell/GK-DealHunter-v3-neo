const rules = [
  // 🟢 股权（增长）
  {
    keys: ["融资","Pre-A","A轮","B轮","C轮","IPO","上市","投资","VC","PE","扩张","招聘扩张","收入增长","营收增长","GMV增长"],
    score: 20,
    type: "股权"
  },

  // 🟡 债权（现金流）
  {
    keys: ["贷款","授信","负债","现金流","回款","应收账款","账期","资金周转","资金紧张","债务","利息","财务费用"],
    score: 25,
    type: "债权"
  },

  // 🔴 短拆（高危）
  {
    keys: ["裁员","缩编","降薪","停招","破产","清算","资金链断裂","拖欠工资","诉讼","仲裁","爆雷","停产","断供"],
    score: 40,
    type: "短拆"
  },

  // 🟣 强机会信号
  {
    keys: ["战略调整","转型","重组","管理层变动","业务剥离","出售资产","IPO暂停","股东退出","资本运作"],
    score: 30,
    type: "机会"
  }
];

export function analyzeCompany(text: string) {
  let score = 0;
  let type = "股权";

  for (const rule of rules) {
    for (const k of rule.keys) {
      if (text.includes(k)) {
        score += rule.score;
        type = rule.type;
      }
    }
  }

  return {
    type,
    score,
    level: score > 80 ? "S" : score > 50 ? "A" : "B",
    reason: "full FA signal engine"
  };
}
