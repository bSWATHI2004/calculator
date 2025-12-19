
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, AppState } from './types';
import { analyzeEmail } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    messages: [
      {
        id: 'initial',
        role: 'assistant',
        content: "Hello! I am PhishGuard AI. Paste the content of any suspicious email here, and I will analyze it for phishing attempts, fraud, and other cybersecurity risks. \n\nPlease include as much detail as possible (sender name, email address, links, etc.)",
        timestamp: Date.now(),
      }
    ],
    isAnalyzing: false,
    error: null,
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isAnalyzing]);

  const handleSend = async () => {
    if (!input.trim() || state.isAnalyzing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isAnalyzing: true,
      error: null,
    }));
    setInput('');

    try {
      const analysis = await analyzeEmail(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: input, // Store original for context
        timestamp: Date.now(),
        analysis: analysis,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isAnalyzing: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: "Failed to analyze email. Please try again or check your API configuration.",
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex-none bg-slate-900 text-white p-4 shadow-xl z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-shield-virus text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PhishGuard AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Email Threat Intelligence</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-80">
            <span className="flex items-center gap-1"><i className="fas fa-check-circle text-green-400"></i> Advanced Reasoning</span>
            <span className="flex items-center gap-1"><i className="fas fa-check-circle text-green-400"></i> Zero-Day Detection</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 md:p-8 space-y-4"
        >
          <div className="max-w-4xl mx-auto pb-24">
            {state.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {state.isAnalyzing && (
              <div className="flex justify-start mb-6">
                <div className="bg-white shadow-md border border-gray-100 rounded-2xl rounded-tl-none p-6 max-w-[80%] flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <i className="fas fa-search absolute inset-0 m-auto w-fit h-fit text-blue-600 text-xs animate-pulse"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Analyzing Content...</h4>
                    <p className="text-sm text-gray-500">Checking for social engineering tactics and malicious patterns.</p>
                  </div>
                </div>
              </div>
            )}

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 mb-6">
                <i className="fas fa-circle-exclamation text-xl"></i>
                <span className="text-sm">{state.error}</span>
                <button 
                  onClick={() => setState(p => ({...p, error: null}))}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Persistent Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste email content here (Ctrl+Enter to send)..."
                  className="w-full px-6 py-4 bg-transparent outline-none text-sm resize-none h-24 max-h-48"
                />
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium">
                    TIP: Including the email headers helps with more accurate detection.
                  </span>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || state.isAnalyzing}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                      !input.trim() || state.isAnalyzing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95'
                    }`}
                  >
                    {state.isAnalyzing ? 'Analyzing...' : 'Scan Email'}
                    <i className={`fas ${state.isAnalyzing ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar Info (Optional / Tooltip Desktop) */}
      <footer className="hidden lg:block fixed bottom-4 right-4 max-w-xs pointer-events-none">
        <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-xl opacity-60">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Live Monitor</h5>
          <div className="flex items-center gap-2 text-[10px] text-green-600 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI System Operational
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
