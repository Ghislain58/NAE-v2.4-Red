
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, BrainCircuit, Activity, Zap, AlertTriangle, 
  Search, LayoutDashboard, Settings, History, Terminal, 
  RefreshCw, Database, CloudDownload, Trash2
} from 'lucide-react';
import { analyzeAsset } from './services/geminiService';
import { fetchLiveContext } from './services/dataPipeline';
import { storageService } from './services/storageService';
import { NAEResponse, ContextData } from './types';
import Dashboard from './components/Dashboard';
import { Assistant } from './components/Assistant';
import { DataControl } from './components/DataControl';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [asset, setAsset] = useState('BTC');
  const [event, setEvent] = useState('Post-Halving Dynamics');
  const [analysis, setAnalysis] = useState<NAEResponse | null>(null);
  const [history, setHistory] = useState<NAEResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assistant' | 'raw' | 'data' | 'history'>('dashboard');

  const [contextInput, setContextInput] = useState<ContextData>({
    factual: "",
    mediatic: "",
    social: "",
    positioning: ""
  });

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleFetchLiveData = async () => {
    if (!asset) return;
    setFetchingData(true);
    setError(null);
    try {
      const liveData = await fetchLiveContext(asset, event);
      setContextInput(liveData);
    } catch (err) {
      setError("Failed to ingest live data. Check pipeline connectivity.");
    } finally {
      setFetchingData(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeAsset(asset, event, contextInput);
      const enrichedResult = { ...result, id: crypto.randomUUID() };
      setAnalysis(enrichedResult);
      storageService.saveAnalysis(enrichedResult);
      setHistory(storageService.getHistory());
      setActiveTab('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown analysis error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a] transition-all">
        <div className="p-4 mb-4 border-b border-[#1a1a1a] flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-600/20">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <span className="hidden md:block font-bold text-lg tracking-tight">NAE-v2.4</span>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center p-3 rounded-lg space-x-3 transition ${activeTab === 'dashboard' ? 'bg-[#1a1a1a] text-red-500' : 'text-gray-400 hover:bg-[#111]'}`}>
            <LayoutDashboard size={20} />
            <span className="hidden md:block font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('data')} className={`w-full flex items-center p-3 rounded-lg space-x-3 transition ${activeTab === 'data' ? 'bg-[#1a1a1a] text-red-500' : 'text-gray-400 hover:bg-[#111]'}`}>
            <Database size={20} />
            <span className="hidden md:block font-medium">Data Pipelines</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center p-3 rounded-lg space-x-3 transition ${activeTab === 'history' ? 'bg-[#1a1a1a] text-red-500' : 'text-gray-400 hover:bg-[#111]'}`}>
            <History size={20} />
            <span className="hidden md:block font-medium">History (DB)</span>
          </button>
          <button onClick={() => setActiveTab('assistant')} disabled={!analysis} className={`w-full flex items-center p-3 rounded-lg space-x-3 transition ${activeTab === 'assistant' ? 'bg-[#1a1a1a] text-red-500' : 'text-gray-400 hover:bg-[#111] disabled:opacity-20'}`}>
            <BrainCircuit size={20} />
            <span className="hidden md:block font-medium">Super Assistant</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <button className="w-full flex items-center p-3 rounded-lg space-x-3 text-gray-500 hover:text-white transition">
            <Settings size={20} />
            <span className="hidden md:block">System Config</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-4 md:px-8 bg-[#0a0a0a]/50 backdrop-blur-xl">
          <div className="flex items-center space-x-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input value={asset} onChange={(e) => setAsset(e.target.value.toUpperCase())} placeholder="Asset" className="w-full bg-[#111] border border-[#222] rounded-md py-2 pl-10 pr-4 outline-none mono text-sm" />
            </div>
            <input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Event Context" className="hidden md:block flex-1 bg-[#111] border border-[#222] rounded-md py-2 px-4 outline-none text-sm" />
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleFetchLiveData}
              disabled={fetchingData || !asset}
              className="bg-[#111] border border-[#222] hover:border-blue-500/50 text-gray-300 py-2 px-4 rounded-md transition flex items-center space-x-2 text-xs mono"
            >
              {fetchingData ? <RefreshCw className="animate-spin" size={14} /> : <CloudDownload size={14} />}
              <span>{fetchingData ? 'INGESTING...' : 'FETCH LIVE DATA'}</span>
            </button>
            <button onClick={handleAnalyze} disabled={loading || !asset} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition flex items-center space-x-2">
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
              <span>{loading ? 'PROCESSING...' : 'ANALYZE'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'data' && <DataControl />}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Analysis History (Database)</h2>
                <button onClick={() => {storageService.clearHistory(); setHistory([]);}} className="text-xs text-red-500 flex items-center space-x-1 hover:underline">
                  <Trash2 size={12} />
                  <span>Purge Records</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {history.map(h => (
                  <div key={h.id} onClick={() => {setAnalysis(h); setActiveTab('dashboard');}} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex items-center justify-between hover:border-red-500/40 cursor-pointer transition">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-500/10 p-2 rounded text-red-500 font-bold mono">{h.asset}</div>
                      <div>
                        <div className="text-sm font-bold">{h.asset} post-event analysis</div>
                        <div className="text-[10px] text-gray-500 mono uppercase">{h.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase font-bold mono">Arbitrage</div>
                        <div className="text-sm font-black text-red-500">{h.arbitrage.score.toFixed(1)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase font-bold mono">Risk</div>
                        <div className={`text-sm font-black ${h.risk_management.permission === 'ALLOW' ? 'text-emerald-500' : 'text-red-500'}`}>{h.risk_management.permission}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && <div className="text-center py-20 text-gray-600 italic">No historical data found in persistent storage.</div>}
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <RefreshCw className="animate-spin text-red-600" size={48} />
              <span className="text-xl font-bold animate-pulse text-red-500 uppercase mono">Neural Convergence in Progress...</span>
            </div>
          )}

          {analysis && !loading && (activeTab === 'dashboard' || activeTab === 'assistant' || activeTab === 'raw') && (
            <div className="space-y-6">
               {activeTab === 'dashboard' && <Dashboard analysis={analysis} />}
               {activeTab === 'assistant' && <Assistant analysis={analysis} />}
               {activeTab === 'raw' && (
                 <pre className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-x-auto mono text-xs text-gray-400">
                   {JSON.stringify(analysis, null, 2)}
                 </pre>
               )}
            </div>
          )}

          {!analysis && !loading && activeTab !== 'data' && activeTab !== 'history' && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Activity size={48} className="text-gray-600 mb-4" />
              <h2 className="text-xl font-bold">Engine Standby</h2>
              <p className="text-gray-500 max-w-sm mt-2">Use 'FETCH LIVE DATA' to automate ingestion or manually define parameters in the sidebar.</p>
            </div>
          )}
        </div>
      </main>

      {/* Manual Override Sidebar */}
      {!loading && (activeTab === 'dashboard' || activeTab === 'data') && (
        <aside className="hidden xl:flex w-80 border-l border-[#1a1a1a] bg-[#0a0a0a] flex-col p-6 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Context Pipeline Override</h3>
            <p className="text-[10px] text-gray-600">Manual adjustments for 4-layer neural processing.</p>
          </div>
          <div className="space-y-4">
            {Object.keys(contextInput).map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] mono uppercase text-gray-600 flex items-center space-x-1">
                   {fetchingData && <RefreshCw size={8} className="animate-spin text-blue-500" />}
                   <span>{key} Data</span>
                </label>
                <textarea 
                  value={contextInput[key as keyof ContextData]}
                  onChange={(e) => setContextInput({...contextInput, [key]: e.target.value})}
                  className="w-full bg-[#111] border border-[#222] rounded p-2 text-[11px] text-gray-300 h-24 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};

export default App;
