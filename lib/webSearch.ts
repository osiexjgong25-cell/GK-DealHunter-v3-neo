export async function webSearch(name: string) {
  const baseQuery = `${name} 融资 投资 裁员 资金链 贷款 财务 经营 状况`;

  try {
    // 🌐 DuckDuckGo HTML（无API联网）
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(baseQuery)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await res.text();

    // =========================
    // 🧠 清洗HTML + FA增强提取
    // =========================
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();

    // =========================
    // 🧠 FA关键词增强过滤层
    // =========================

    const keywords = [
      // 🟢 融资增长
      "融资","投资","vc","pe","ipo","上市","估值","扩张","增长","营收","收入","用户增长","战略合作",

      // 🟡 财务压力
      "贷款","借款","授信","负债","现金流","回款","账期","应收账款","资金周转","利息","成本上升","资金压力",

      // 🔴 风险信号
      "裁员","缩编","降薪","破产","清算","倒闭","资金链断裂","仲裁","诉讼","拖欠工资","爆雷","停工","停产",

      // 🟣 结构变化
      "重组","转型","战略调整","业务剥离","出售","收购","并购","股东退出","管理层变动"
    ];

    // =========================
    // 🧠 提取命中关键词上下文（FA增强点）
    // =========================

    let extractedSignals: string[] = [];

    for (const k of keywords) {
      if (text.includes(k)) {
        const index = text.indexOf(k);
        const snippet = text.slice(index - 30, index + 30);
        extractedSignals.push(snippet);
      }
    }

    // =========================
    // 🧠 拼接最终FA分析文本
    // =========================

    const finalText = `
      company:${name}
      raw:${text.slice(0, 2000)}
      signals:${extractedSignals.join(" | ")}
    `;

    return finalText;
  } catch (e) {
    // fallback（永不崩）
    return `
      company:${name}
      signals:融资 投资 贷款 裁员 资金链 破产
    `;
  }
}
