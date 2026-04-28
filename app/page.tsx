// app/page.tsx
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
    setClients(data || []);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAnalyze = async () => {
    if (!input.trim() || loading) return;
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
    <div className="min-h-screen bg-[#FBFBFA] text-[#37352F] p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
          <Database className="text-blue-600" /> DealHunter Notion
        </h1>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <textarea 
            className="w-full p-2 outline-none resize-none text-base border-none" 
            placeholder="输入企业名称（每行一个）..." 
            rows={3} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
              {loading ? '挖掘中...' : '开始挖掘'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {['未联系', '跟进中', '已结束'].map(col => (
          <div key={col} className="bg-[#F2F1EE] rounded-lg p-3 min-h-[400px]">
            <h3 className="font-bold mb-4 flex items-center gap-2 px-2 text-gray-500 text-sm uppercase">
              {col === '未联系' ? <Clock size={14}/> : col === '跟进中' ? <PlusCircle size={14}/> : <CheckCircle size={14}/>} {col}
              <span className="ml-auto text-xs font-normal opacity-50">{clients.filter(c => c.status === col).length}</span>
            </h3>
            {clients.filter(c => (c as any).status === col).map((c: any) => (
              <div key={c.id} className="bg-white p-4 rounded-md mb-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{c.level}级 · {c.type}</span>
                  <span className="text-blue-600 font-bold">{c.score}</span>
                </div>
                <div className="font-bold text-gray-800 mb-1">{c.name}</div>
                <div className="text-[11px] text-gray-500 mb-4 leading-relaxed">{c.summary}</div>
                {col !== '已结束' && (
                  <button 
                    onClick={() => moveStatus(c.id, col === '未联系' ? '跟进中' : '已结束')}
                    className="w-full py-1.5 bg-gray-50 text-[11px] font-medium rounded border border-gray-200 hover:bg-gray-100"
                  >
                    推进至 {col === '未联系' ? '跟进中' : '已结束'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
