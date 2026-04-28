// lib/analyzer.ts

export type AnalysisResult = {
  score: number;
  level: 'S' | 'A' | 'B';
  type: '股权' | '债权' | '风险';
  tags: string[];
  summary: string;
};

export function analyzeCompany(text: string): AnalysisResult {
  let score = 50; // 初始分
  const tags: string[] = [];
  
  // 1. 股权类逻辑 (加分项)
  const equityRules = [
    { k: "融资", s: 10, t: "活跃融资" },
    { k: "轮次", s: 5, t: "有历史融资" },
    { k: "IPO", s: 20, t: "上市潜力" },
    { k: "投资", s: 5, t: "资本关注" },
    { k: "扩产", s: 10, t: "业务扩张" },
    { k: "研发", s: 5, t: "技术驱动" }
  ];

  // 2. 债权/短拆类逻辑 (属性识别)
  const debtRules = [
    { k: "贷款", s: 5, t: "有贷款需求" },
    { k: "周转", s: 5, t: "短期周转" },
    { k: "抵押", s: 10, t: "资产抵押" },
    { k: "过桥", s: 15, t: "过桥诉求" }
  ];

  // 3. 负面/风险类 (扣分项)
  const riskRules = [
    { k: "裁员", s: -20, t: "经营波动" },
    { k: "资金链断裂", s: -40, t: "极高风险" },
    { k: "诉讼", s: -10, t: "法律纠纷" },
    { k: "爆雷", s: -30, t: "信用危机" }
  ];

  let equityScore = 0;
  let debtScore = 0;

  // 执行扫描
  equityRules.forEach(r => {
    if (text.includes(r.k)) {
      score += r.s;
      equityScore += r.s;
      tags.push(r.t);
    }
  });

  debtRules.forEach(r => {
    if (text.includes(r.k)) {
      score += r.s;
      debtScore += r.s;
      tags.push(r.t);
    }
  });

  riskRules.forEach(r => {
    if (text.includes(r.k)) {
      score += r.s;
      tags.push(r.t);
    }
  });

  // 确定客户类型
  let type: '股权' | '债权' | '风险' = '股权';
  if (debtScore > equityScore) type = '债权';
  if (score < 40) type = '风险';

  // 确定等级 (用于 Notion 看板标签)
  let level: 'S' | 'A' | 'B' = 'B';
  if (score >= 80) level = 'S';
  else if (score >= 60) level = 'A';

  // 自动生成一句话摘要
  const summary = `${type}类客户，匹配到[${tags.slice(0,3).join('/')}]等特征，建议${level === 'S' ? '立即跟进' : '持续关注'}。`;

  return {
    score: Math.min(100, Math.max(0, score)), // 限制在0-100
    level,
    type,
    tags: Array.from(new Set(tags)), // 去重
    summary
  };
}
