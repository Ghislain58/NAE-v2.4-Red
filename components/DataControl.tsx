
import React from 'react';
import { Database, Share2, Users, Target, CheckCircle2, Wifi, WifiOff, Activity, Layers, ArrowLeftRight } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  latency: string;
  details?: string;
}

const SOURCES: Record<string, DataSource[]> = {
  factual: [
    { id: '1', name: 'FRED Macro Data', type: 'REST', status: 'online', latency: '120ms' },
    { id: '2', name: 'AlphaVantage Live', type: 'WSS', status: 'online', latency: '45ms' }
  ],
  mediatic: [
    { id: '3', name: 'NewsAPI Terminal', type: 'REST', status: 'online', latency: '350ms' },
    { id: '4', name: 'SEC EDGAR Crawler', type: 'CRON', status: 'online', latency: 'N/A' }
  ],
  social: [
    { id: '5', name: 'LunarCrush Engine', type: 'API', status: 'online', latency: '210ms' },
    { id: '6', name: 'X-Stream API', type: 'WSS', status: 'offline', latency: 'N/A' }
  ],
  behavioral: [
    { id: '7', name: 'Derivatives Feed (OI/Fund)', type: 'WSS', status: 'online', latency: '12ms', details: 'Funding, Basis, OI' },
    { id: '8', name: 'Options Surface (IV/Skew)', type: 'FIX', status: 'online', latency: '35ms', details: 'Vol Surface, Gamma' },
    { id: '9', name: 'Order Book L2 (Agg)', type: 'WSS', status: 'online', latency: '8ms', details: 'Depth, Imbalance' }
  ]
};

export const DataControl: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Data Ingestion Network</h2>
          <p className="text-xs text-gray-500 mono uppercase tracking-widest">Microstructure & Temporal feeds</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] mono">8/9 ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(SOURCES).map(([layer, sources]) => (
          <div key={layer} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 hover:border-red-500/20 transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-red-600/10 rounded-lg text-red-500">
                  {layer === 'factual' && <Database size={16} />}
                  {layer === 'mediatic' && <Share2 size={16} />}
                  {layer === 'social' && <Users size={16} />}
                  {layer === 'behavioral' && <Target size={16} />}
                </div>
                <h3 className="text-sm font-bold uppercase mono tracking-tighter text-gray-300">{layer} Pipeline</h3>
              </div>
              <CheckCircle2 size={14} className="text-emerald-500 opacity-50" />
            </div>

            <div className="space-y-3">
              {sources.map(source => (
                <div key={source.id} className="flex flex-col p-3 bg-[#111] rounded-xl border border-[#222] group-hover:border-[#333] transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={source.status === 'online' ? 'text-emerald-500' : 'text-red-500'}>
                        {source.status === 'online' ? <Wifi size={14} /> : <WifiOff size={14} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-200">{source.name}</div>
                        <div className="text-[9px] text-gray-600 mono">{source.type} INGESTION</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 mono">{source.latency}</div>
                      <div className="text-[8px] text-gray-700 uppercase">Latency</div>
                    </div>
                  </div>
                  {source.details && (
                    <div className="mt-2 pt-2 border-t border-[#222] flex items-center space-x-2 text-[9px] text-gray-500 mono">
                       {layer === 'behavioral' && <Activity size={10} />}
                       <span>{source.details}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-red-900/5 border border-dashed border-red-500/20 rounded-2xl text-center">
        <div className="flex items-center justify-center space-x-2 mb-2 text-red-500">
           <Layers size={16} />
           <ArrowLeftRight size={16} />
        </div>
        <h4 className="text-sm font-bold text-gray-300 mb-1">Microstructure Integration</h4>
        <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
          Currently aggregating L2 snapshots and Options Surface data via search grounding. 
          For millisecond-level precision, enable the dedicated WebSocket Adapter in System Config.
        </p>
      </div>
    </div>
  );
};
