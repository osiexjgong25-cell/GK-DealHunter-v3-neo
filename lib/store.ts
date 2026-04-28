export interface Client {
  id: string;
  name: string;
  score: number;
  level: 'S' | 'A' | 'B';
  type: string; 
  tags: string[];
  summary: string;
  source: string;
  status: string;
}

let clients: Client[] = [];

export const getClients = () => clients;

export const addClient = (c: Omit<Client, 'id' | 'status'>) => {
  const newClient: Client = {
    id: `FA_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...c,
    status: '未联系',
  };
  clients.push(newClient);
  return newClient;
};

export const updateClientStatus = (id: string, newStatus: string) => {
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) clients[index].status = newStatus;
};

export const clearClients = () => { clients = []; }; // 统一名字为 clearClients
