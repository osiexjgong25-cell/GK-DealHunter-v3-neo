"use client";

import { useState } from "react";

export default function Batch() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any[]>([]);

  const runBatch = async () => {
    const list = text.split("\n").filter(Boolean);

    const res = await fetch("/api/batch", {
      method: "POST",
      body: JSON.stringify({ list })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>批量扫描（FA入口）</h2>

      <textarea
        rows={10}
        style={{ width: "100%" }}
        placeholder="每行一个公司"
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={runBatch}>开始分析</button>

      <div>
        {result.map((r, i) => (
          <div key={i} style={{ marginTop: 10 }}>
            <b>{r.name}</b> | {r.type} | {r.score} | {r.level}
          </div>
        ))}
      </div>
    </div>
  );
}
