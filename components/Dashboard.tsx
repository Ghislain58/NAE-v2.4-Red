
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  ShieldCheck, 
  XCircle, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Flame,
  Cpu,
  Target,
  Info,
  Dna,
  Clock,
  Timer,
  ZapOff
} from 'lucide-react';
import { NAEResponse, LayerData, Metric } from '../types';

interface DashboardProps {
  analysis: NAEResponse;
}

const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const fusionSignals = [
    { name: 'Macro', val: analysis.neural_synthesis?.signals?.macro || 0 },
    { name: 'Price', val: analysis.neural_synthesis?.signals?.price_action || 0 },
    { name: 'Sent.', val: analysis.neural_synthesis?.signals?.sentiment || 0 },
    { name: 'Behav.', val: analysis.neural_synthesis?.signals?.behavioral || 0 },
  ];

  const getPermissionColor = (p: string) => {
    switch (p) {
      case 'ALLOW': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'REDUCE': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'BLOCK': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500';
    }
  };

  const getNarrativeColor = (state: string) => {
    switch (state) {
      case 'euphorie': return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'panique': return 'text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
      case 'déni': return 'text-orange-400 border-orange-500/40 bg-orange-500/5';
      case 'transition': return 'text-blue-400 border-blue-500/40 bg-blue-500/5';
      case 'manipulation': return 'text-purple-400 border-purple-500/40 bg-purple-500/5';
      case 'compression': return 'text-yellow-400 border-yellow-500/40 bg-yellow-500/5';
      default: return 'text-gray-400 border-gray-500/40 bg-gray-500/5';
    }
  };

  const getVelocityColor = (v: string) => {
    switch (v) {
      case 'REALTIME': return 'text-red-500';
      case 'FAST': return 'text-orange-400';
      case 'MODERATE': return 'text-blue-400';
      case 'SLOW': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 pb-20">
      {/* Neural Fusion Header Widget */}
      <div className="col-span-12 lg:col-span-5 bg-[#0a0a0a] border border-red-500/20 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition">
          <Cpu size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-bold text-red-500 flex items-center uppercase mono tracking-widest">
              <Cpu size={14} className="mr-2" />
              Neural Fusion Synthesis
            </h3>
            <div className={`px-3 py-1 rounded border text-[10px] font-black uppercase tracking-[0.2em] mono ${getNarrativeColor(analysis.neural_synthesis?.narrative_state)}`}>
              <Dna size={10} className="inline mr-1.5 mb-0.5" />
              {analysis.neural_synthesis?.narrative_state || 'UNKNOWN'}
            </div>
          </div>
          
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-4xl font-black text-white tracking-tighter">
                {((analysis.neural_synthesis?.conflict_score || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mono">Conflict Score</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-300">
                {(analysis.neural_synthesis?.confidence || 0).toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mono">Fusion Confidence</div>
            </div>
          </div>
          
          <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-red-600 transition-all duration-1000 ease-out" 
              style={{ width: `${(analysis.neural_synthesis?.conflict_score || 0) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={10} className="text-gray-600" />
            <p className="text-[9px] text-gray-500 mono uppercase tracking-tight">
              Desync Risk: <span className={analysis.neural_synthesis?.temporal_asymmetry?.desync_risk > 0.7 ? 'text-red-500 font-bold' : 'text-emerald-500'}>
                {((analysis.neural_synthesis?.temporal_asymmetry?.desync_risk || 0) * 100).toFixed(0)}%
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temporal Asymmetry Awareness Card */}
        <div className="bg-[#0a0a0a] border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-blue-500 flex items-center uppercase mono tracking-widest">
              <Timer size={14} className="mr-2" />
              Temporal Awareness
            </h3>
            {analysis.neural_synthesis?.temporal_asymmetry?.velocity_mismatch && (
              <Zap size={12} className="text-orange-500 animate-pulse" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-[#111] p-2 rounded">
              <span className="text-[9px] text-gray-500 uppercase mono block">Leading Signal</span>
              <span className="text-[10px] font-bold text-emerald-400">{analysis.neural_synthesis?.temporal_asymmetry?.lead_signal}</span>
            </div>
            <div className="bg-[#111] p-2 rounded">
              <span className="text-[9px] text-gray-500 uppercase mono block">Lagging Signal</span>
              <span className="text-[10px] font-bold text-red-400">{analysis.neural_synthesis?.temporal_asymmetry?.lag_signal}</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic line-clamp-2">
            {analysis.neural_synthesis?.temporal_asymmetry?.logic_rationale}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded-2xl flex flex-col justify-center text-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold mono mb-1">Arbitrage</div>
            <div className="text-2xl font-black text-red-500">{(analysis.arbitrage?.score || 0).toFixed(1)}</div>
          </div>
          <div className={`border p-5 rounded-2xl flex flex-col justify-center text-center transition-all ${getPermissionColor(analysis.risk_management?.permission || 'BLOCK')}`}>
            <div className="text-[10px] opacity-70 uppercase font-bold mono mb-1">Risk Permit</div>
            <div className="text-xl font-black">{analysis.risk_management?.permission || 'UNKNOWN'}</div>
          </div>
        </div>
      </div>

      {/* Fusion Signal Matrix */}
      <div className="col-span-12 lg:col-span-8 bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl">
        <h3 className="text-xs font-bold text-gray-400 mb-6 flex items-center uppercase mono tracking-widest">
          <Target size={14} className="mr-2 text-red-500" />
          Fusion Signal Matrix (Desynchronized Logic)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fusionSignals} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1a1a1a" />
              <XAxis type="number" domain={[-1, 1]} hide />
              <YAxis dataKey="name" type="category" tick={{ fill: '#666', fontSize: 10 }} width={50} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#1a1a1a' }}
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="val" radius={[0, 4, 4, 0]}>
                {fusionSignals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.val >= 0 ? '#10b981' : '#ef4444'} fillOpacity={Math.abs(entry.val) + 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Momentum Gate */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl h-full">
          <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center uppercase mono tracking-wider">
            <TrendingUp size={16} className="mr-2 text-blue-500" />
            Momentum Gate
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-[#111] rounded-lg border border-[#222]">
                <span className="text-xs text-gray-500 uppercase mono">Actionable</span>
                <span className={analysis.momentum_gate?.actionable ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                   {analysis.momentum_gate?.actionable ? 'TRUE' : 'FALSE'}
                </span>
             </div>
             
             <div className="space-y-3 px-1">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500">Alignment</span>
                 <span className="text-white mono">{analysis.momentum_gate?.alignment || 'UNKNOWN'}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500">Regime</span>
                 <span className="text-white mono">{analysis.momentum_gate?.regime || 'UNKNOWN'}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Column - Layers */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(analysis.layers || {}) as [string, LayerData][]).map(([key, layer]) => (
          <div key={key} className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded-xl hover:border-red-500/30 transition flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600 mono">{key} Layer</span>
                <span className={`text-[8px] font-black uppercase mono mt-0.5 ${getVelocityColor(layer.velocity)}`}>
                   {layer.velocity} FREQ
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${layer.status === 'OK' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'}`}>
                {layer.status}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3 h-15 font-light">{layer.summary}</p>
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {layer.key_metrics?.slice(0, 4).map((metric: Metric, idx: number) => (
                <div key={idx} className="bg-[#111] p-2 rounded flex flex-col min-w-0">
                  <span className="text-[10px] text-gray-600 truncate uppercase mono">{metric.label}</span>
                  <span className="text-[11px] font-bold truncate text-gray-300">{metric.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex justify-between items-center">
               <span className="text-[9px] text-gray-700 uppercase mono">Update Cycle</span>
               <span className="text-[9px] text-gray-500 mono">{layer.update_frequency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Simulation */}
      {analysis.strategy_simulation?.enabled && (
        <div className="col-span-12 bg-red-900/5 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
          <h3 className="text-sm font-bold text-red-500 mb-6 flex items-center uppercase mono tracking-wider">
            <Zap size={16} className="mr-2" />
            Strategy Execution Framework
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-[#222] pb-2">
                <span className="text-xs text-gray-500">Target Entry Zone</span>
                <span className="text-xs font-bold mono text-emerald-400">@{analysis.strategy_simulation.zones.entry}</span>
              </div>
              <div className="flex justify-between border-b border-[#222] pb-2">
                <span className="text-xs text-gray-500">Invalidation (Stop)</span>
                <span className="text-xs font-bold mono text-red-400">@{analysis.strategy_simulation.zones.stop}</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-gray-500 block mb-2">Profit Take Targets</span>
              <div className="flex flex-wrap gap-2">
                {analysis.strategy_simulation.zones.targets.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-[11px] mono rounded-lg text-emerald-500">
                    T{i+1}: {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 leading-relaxed italic">
              <span className="text-gray-600 block mb-1 uppercase font-bold text-[10px] mono">Rationale:</span>
              {analysis.strategy_simulation.rationale}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
