"use client";

import { useEffect, useState } from "react";

export default function Clients() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await fetch("/api/clients");
    setData(await res.json());
  };

  const update = async (id: string, status: string) => {
    await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ id, status })
    });

    load();
  };

  const clear = async () => {
    await fetch("/api/clear", { method: "POST" });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>客户池</h2>

      <button onClick={clear}>一键清空</button>

      {data.map((c: any) => (
        <div key={c.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{c.name}</h3>
          <p>{c.type} | {c.score} | {c.level}</p>

          <button onClick={() => update(c.id, "已联系")}>已联系</button>
          <button onClick={() => update(c.id, "跟进")}>跟进</button>
          <button onClick={() => update(c.id, "成交")}>成交</button>
        </div>
      ))}
    </div>
  );
}
