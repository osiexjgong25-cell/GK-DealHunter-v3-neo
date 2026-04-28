let clients: any[] = [];

export function addClient(c: any) {
  clients.push({
    id: Date.now().toString() + Math.random(),
    ...c,
    status: "未联系"
  });
}

export function getClients() {
  return clients;
}

export function updateStatus(id: string, status: string) {
  clients = clients.map(c =>
    c.id === id ? { ...c, status } : c
  );
}

export function clearAll() {
  clients = [];
}
