// app/page.tsx 完整版 - 确保复制到最后一行
'use client';

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Database, CheckCircle, Clock, Loader2 } from 'lucide-react';

export default function NotionFA() {
  const [input, setInput] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = ['未联系', '跟进中', '已结束'];

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const list = input.split('\n').filter(i => i.trim());
    await fetch('/api/batch', {
      method: 'POST',
      body: JSON.stringify({ list }),
    });
    setInput('');
    await fetchClients();
    setLoading(false);
  };

  const moveStatus = async (id: string, newStatus: string) => {
    await fetch('/api/update', {
      method: 'POST',
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchClients();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#37352F] p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" /> DealHunter Pro
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Notion Style Financing Pipeline</p>
      </div>

      <div className="max-w-6xl mx-auto mb-10 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <textarea
          className="w-full p-3 border-none focus:ring-0 text-lg resize-none outline-none"
          placeholder="输入公司名称（每行一个）..."
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-between items-center mt-3 border-t pt-3">
          <span className="text-xs text-gray-400">支持批量输入分析</span>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
            开始挖掘
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col} className="bg-[#F2F1EE] rounded-lg p-3 min-h-[500px]">
            <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-gray-600 mb-4 px-2">
              {col === '未联系' && <Clock className="w-4 h-4" />}
              {col === '跟进中' && <PlusCircle className="w-4 h-4 text-orange-500" />}
              {col === '已结束' && <CheckCircle className="w-4 h-4 text-green-600" />}
              {col}
            </h3>

            <div className="space-y-3">
              {clients.filter(c => c.status === col).map((client: any) => (
                <div key={client.id} className="bg-white border border-gray-200 p-4 rounded-md shadow-sm group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600">
                      {client.level}级 · {client.type}
                    </span>
                    <span className="text-lg font-bold text-blue-600">{client.score}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{client.name}</h4>
                  <p className="text-[11px] text-gray-500 mb-3 line-clamp-2">{client.summary}</p>
                  
                  <div className="flex gap-2 border-t pt-3 mt-2">
                    {col === '未联系' && (
                      <button onClick={() => moveStatus(client.id, '跟进中')} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded w-full">设为跟进</button>
                    )}
                    {col === '跟进中' && (
                      <button onClick={() => moveStatus(client.id, '已结束')} className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded w-full">完成联系</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
