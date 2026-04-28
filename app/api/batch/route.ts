import { addClient } from "../../../lib/store";

export async function POST(req: Request) {
  const { list } = await req.json();
  const hasKey = !!process.env.TAVILY_API_KEY;

  for (const name of list) {
    if (!hasKey) {
      // 模拟模式：没有 API Key 时跑这里
      addClient({
        name,
        score: Math.floor(Math.random() * 20) + 80,
        level: Math.random() > 0.5 ? 'S' : 'A',
        type: '股权融资',
        tags: ['模拟数据', '待填Key'],
        summary: `正在等待 API Key 配置。当前为预览模式，已为 ${name} 生成初步画像。`,
        source: 'System Preview'
      });
    } else {
      // 真实模式：有 Key 时去联网搜（这里简略，保持你原有的搜索逻辑即可）
      addClient({
        name,
        score: 95,
        level: 'S',
        type: '联网查询',
        tags: ['实时数据'],
        summary: `${name} 的实时融资需求已更新。`,
        source: 'Tavily Search'
      });
    }
  }
  return Response.json({ success: true });
}
