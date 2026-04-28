'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Search, UserClock, CheckCircle, Database } from 'lucide-react';

// Notion 风格的标签组件
const Tag = ({ children, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>{children}</span>;
};

// 客户卡片组件
const ClientCard = ({ client, onUpdateStatus }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 hover:border-gray-200 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-gray-900 truncate flex-1">{client.name}</h3>
      <Tag color={client.level === 'S' ? 'red' : client.level === 'A' ? 'green' : 'gray'}>
        {client.level}级
      </Tag>
    </div>
    <p className="text-sm text-gray-500 mb-3 truncate">{client.id} {client.contactName}</p>
    <div className="flex justify-between items-center text-xs text-gray-400">
      <span>分数: {client.score}</span>
      <div className="flex gap-1.5">
        {client.status !== '已联系' && (
          <button onClick={() => onUpdateStatus(client.id, '已联系')} className="text-gray-400 hover:text-blue-600">标记为已联系</button>
        )}
        {client.status !== '跟进中' && (
          <button onClick={() => onUpdateStatus(client.id, '跟进中')} className="text-gray-400 hover:text-yellow-600">移动至跟进</button>
        )}
      </div>
    </div>
  </div>
);

// 看板列组件
const KanbanColumn = ({ title, icon: Icon, clients, onUpdateStatus, color }) => (
  <div className="flex-1 bg-gray-50 rounded-2xl p-4 min-w-[300px]">
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
      </div>
      <span className="text-gray-400 text-sm bg-white px-3 py-1 rounded-full font-mono border border-gray-100">
        {clients.length}
      </span>
    </div>
    <div className="space-y-1">
      {clients.map(client => (
        <ClientCard key={client.id} client={client} onUpdateStatus={onUpdateStatus} />
      ))}
      {clients.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
          暂无客户
        </div>
      )}
    </div>
  </div>
);

export default function NotionDealHunter() {
  const [clients, setClients] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 获取初始数据
  useEffect(() => {
    fetch('/api/clients').then(res => res.json()).then(data => setClients(data));
  }, []);

  // 批量扫描 (FA 入口按钮)
  const handleBatchScan = async () => {
    setIsAnalyzing(true);
    const names = inputText.split('\n').filter(name => name.trim());
    await fetch('/api/batch', {
      method: 'POST',
      body: JSON.stringify({ list: names })
    });
    // 重新拉取数据
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(data);
    setIsAnalyzing(false);
    setInputText('');
  };

  // 更新状态 (跟进/已联系按钮)
  const handleUpdateStatus = async (id, status) => {
    await fetch('/api/update', {
      method: 'POST',
      body: JSON.stringify({ id, status })
    });
    // 本地更新 UI
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  // 根据不同池子筛选客户
  const poolLeads = clients.filter(c => c.status === '未联系');
  const poolFollowing = clients.filter(c => c.status === '跟进中');
  const poolContacted = clients.filter(c => c.status === '已联系');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Notion 顶部导航 */}
      <header className="border-b border-gray-100 py-3 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-bold">GK DealHunter <span className='text-gray-300 font-normal'>v3.3</span></h1>
        </div>
        <div className="flex gap-2">
          <Tag color="gray">当前客户总数: {clients.length}</Tag>
          <button className="text-gray-500 hover:text-gray-900">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 批量输入区域 (Notion Callout 风格) */}
      <div className="max-w-5xl mx-auto p-6 my-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex gap-3 items-center mb-4">
          <Search className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">批量扫描线索池</h2>
          <span className='text-gray-400 text-sm'>（每行一个公司）</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="例如: 深圳市大成自动化设备有限公司"
          className="w-full h-32 p-4 border border-gray-200 rounded-xl bg-white mb-4 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all text-sm"
        />
        <button
          onClick={handleBatchScan}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${isAnalyzing ? 'bg-gray-300 text-gray-500' : 'bg-gray-900 text-white hover:bg-black'}`}
        >
          {isAnalyzing ? '正在联网画像...' : '开始批量分析线索'}
          {!isAnalyzing && <PlusCircle className="w-5 h-5" />}
        </button>
      </div>

      {/* 看板工作流 */}
      <div className="px-6 py-4 flex gap-6 overflow-x-auto pb-10">
        <KanbanColumn 
          title="未联系 (待挖掘)" 
          icon={Search} 
          clients={poolLeads} 
          onUpdateStatus={handleUpdateStatus}
          color="text-red-500"
        />
        <KanbanColumn 
          title="跟进中 (意向)" 
          icon={UserClock} 
          clients={poolFollowing} 
          onUpdateStatus={handleUpdateStatus}
          color="text-yellow-500"
        />
        <KanbanColumn 
          title="已联系 (项目)" 
          icon={CheckCircle} 
          clients={poolContacted} 
          onUpdateStatus={handleUpdateStatus}
          color="text-green-500"
        />
      </div>
    </div>
  );
}
