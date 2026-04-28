// lib/store.ts

export interface Client {
  id: string;
  name: string;
  score: number;
  level: 'S' | 'A' | 'B';
  type: string;     // ✅ 允许任意分类（如：股权、债权、风险、机会）
  tags: string[];
  summary: string;
  source: string;
  status: string;   // ✅ 兼容不同的池子状态
}

// 内存数据库
let clients: Client[] = [];

export function getClients() {
  return clients;
}

export function addClient(c: Omit<Client, 'id' | 'status'>): Client {
  const newClient: Client = {
    id: `FA_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...c,
    status: '未联系', // 默认进入第一个池子
  };
  clients.push(newClient);
  return newClient;
}

export function updateClientStatus(id: string, newStatus: string) {
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) {
    clients[index].status = newStatus;
    return clients[index];
  }
  return null;
}

export function clearClients() {
  clients = [];
}
