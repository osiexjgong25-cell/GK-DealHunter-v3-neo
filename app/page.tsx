'use client';
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Database, CheckCircle, Clock, Loader2 } from 'lucide-react';

export default function NotionFA() {
  const [input, setInput] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await fetch('/api/batch', {
      method: 'POST',
      body: JSON.stringify({ list: input.split('\n').filter(i => i.trim()) }),
    });
    setInput('');
    await fetchClients();
    setLoading(false);
  };

  const moveStatus = async (id: string, s: string) => {
    await fetch('/api/update', { method: 'POST', body: JSON.stringify({ id, status: s }) });
    fetchClients();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#37352F] p-8">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Database className="text-blue-600" /> DealHunter Pro</h1>
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <textarea className="w-full p-2 outline-none resize-none text-lg" placeholder="输入公司名..." rows={3} value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={handleAnalyze} disabled={loading} className="mt-3 bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 disabled:bg-gray-300">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />} 开始挖掘
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {['未联系', '跟进中', '已结束'].map(col => (
          <div key={col} className="bg-[#F2F1EE] rounded-lg p-3 min-h-[400px]">
            <h3 className="font-bold mb-4 flex items-center gap-2 px-2 text-gray-600 italic">
              {col === '未联系' ? <Clock size={16}/> : col === '跟进中' ? <PlusCircle size={16}/> : <CheckCircle size={16}/>} {col}
            </h3>
            {clients.filter(c => c.status === col).map((c: any) => (
              <div key={c.id} className="bg-white p-4 rounded mb-3 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{c.level}级 · {c.type}</span>
                  <b className="text-blue-600">{c.score}</b>
                </div>
                <div className="font-bold mb-1">{c.name}</div>
                <div className="text-[11px] text-gray-400 mb-3">{c.summary}</div>
                {col !== '已结束' && (
                  <button onClick={() => moveStatus(c.id, col === '未联系' ? '跟进中' : '已结束')} className="w-full py-1 bg-gray-50 text-[10px] rounded hover:bg-gray-100 border">下一步</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
