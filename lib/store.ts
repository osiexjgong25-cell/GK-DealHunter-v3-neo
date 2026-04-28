// lib/store.ts
// 用于临时存储数据（重启后会清空），实际生产中建议换成 Redis 或 Postgres

// 严格定义客户类型，以便在 Notion 卡片中显示
export type Client = {
  id: string;
  name: string;
  contactName?: string; // 如果你有这个数据
  level: 'S' | 'A' | 'B'; // 评分等级
  score: number;
  type: '股权' | '债权';
  status: '未联系' | '跟进中' | '已联系' | '已流失'; // 池子状态
};

let clients: Client[] = [];

// 1. 添加新客户时，默认进入“未联系”池子
export function addClient(c: Omit<Client, 'id' | 'status'>) {
  const newClient: Client = {
    id: `FA_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // 生成唯一FA编码
    ...c,
    status: '未联系', // 强制默认状态
  };
  clients.push(newClient);
  console.log(`[Store] 已将客户 ${c.name} 加入待扫描池`);
}

// 2. 获取所有客户
export function getClients(): Client[] {
  return clients;
}

// 3. 更新客户状态（配合前端“已联系”、“移动”按钮）
export function updateClientStatus(id: string, status: Client['status']) {
  clients = clients.map(c => c.id === id ? { ...c, status } : c);
  console.log(`[Store] 客户 ${id} 状态已更新为 ${status}`);
}

// 4. 清空数据（Notion风格不需要这个按钮，建议后台保留）
export function clearAll() {
  clients = [];
}
