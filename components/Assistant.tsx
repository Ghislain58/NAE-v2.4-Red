
import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, User, Bot, RefreshCw, AlertCircle } from 'lucide-react';
import { NAEResponse } from '../types';
import { askAssistant } from '../services/geminiService';

interface AssistantProps {
  analysis: NAEResponse;
}

export const Assistant: React.FC<AssistantProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: `System initialized. I am your NAE v2.4 Super Assistant. I have internalized the analysis of ${analysis.asset}. How can I help you contextualize these results?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await askAssistant(userMsg, analysis);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: Could not retrieve response from neural core." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-4xl mx-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0f0f0f]">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600/20 p-2 rounded-lg">
            <BrainCircuit size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">Super Assistant Module</h3>
            <p className="text-[10px] text-gray-500 uppercase mono">Cognitive Interface v1.0.4</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-[#1a1a1a] rounded-full">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] mono text-gray-400">READ-ONLY ACCESS</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-red-600/10 border border-red-500/20' : 'bg-gray-800 border border-gray-700'}`}>
                  {m.role === 'user' ? <User size={16} className="text-red-500" /> : <Bot size={16} className="text-gray-400" />}
               </div>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-[#151515] border border-[#222] text-gray-300 rounded-tl-none'}`}>
                  {m.text.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
               </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center animate-pulse">
                   <RefreshCw size={16} className="text-gray-500 animate-spin" />
                </div>
                <div className="bg-[#151515] border border-[#222] p-4 rounded-2xl flex space-x-2">
                   <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="flex items-center space-x-3 bg-[#111] border border-[#222] p-1.5 pl-4 rounded-xl focus-within:border-red-500/50 transition shadow-inner">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about divergence factors, risk logic, or evidence..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white rounded-lg transition"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-4 opacity-50">
           <span className="text-[10px] text-gray-600 flex items-center space-x-1">
             <AlertCircle size={10} />
             <span>Cannot modify JSON output</span>
           </span>
           <span className="text-[10px] text-gray-600 flex items-center space-x-1">
             <AlertCircle size={10} />
             <span>strictly evidence-based</span>
           </span>
        </div>
      </div>
    </div>
  );
};
