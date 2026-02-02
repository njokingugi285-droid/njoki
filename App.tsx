
import React, { useState, useRef, useEffect } from 'react';
import Disclaimer from './components/Disclaimer';
import EmergencyStrip from './components/EmergencyStrip';
import { analyzeSymptoms } from './services/geminiService';
import { HealthInfoResponse } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (result) scrollToBottom();
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSymptoms(input);
      setResult(data);
    } catch (err) {
      setError('Something went sideways while checking your symptoms. Try again, bestie?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  const handleQuestionClick = (question: string) => {
    setInput(prev => prev + (prev.endsWith(' ') ? '' : ' ') + question + ' ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <i className="fas fa-heartbeat text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Njoki</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Your Health Bestie</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            Start Over
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Disclaimer />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all hover:shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-comment-medical text-indigo-500"></i>
                What's the vibe today? Tell me how you're feeling...
              </h2>
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Njoki is here. Spill the tea on your symptoms, when they started, and what's bothering you..."
                  className="w-full h-32 p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  disabled={loading}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                      loading || !input.trim() 
                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    }`}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-wand-magic-sparkles animate-pulse"></i>
                        Njoki is listening...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Let's sort this out
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <i className="fas fa-circle-exclamation text-lg"></i>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-l-8 border-indigo-500 bg-indigo-50/30">
                  <p className="text-slate-800 leading-relaxed text-lg">
                    {result.summary}
                  </p>
                </div>

                <div className="p-6 space-y-8">
                  {/* Clarifying Questions */}
                  {result.isVague && result.questionsToUser && result.questionsToUser.length > 0 && (
                    <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                      <h4 className="text-amber-900 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fas fa-clipboard-question text-amber-500"></i>
                        Help me help you, bestie:
                      </h4>
                      <div className="space-y-2">
                        {result.questionsToUser.map((q, idx) => (
                          <button 
                            key={idx}
                            onClick={() => handleQuestionClick(q)}
                            className="w-full text-left p-3 bg-white border border-amber-100 rounded-lg text-amber-800 text-sm hover:bg-amber-100 transition-colors flex items-center justify-between group"
                          >
                            <span>{q}</span>
                            <i className="fas fa-plus text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Red Flags - Critical */}
                  {result.redFlags.length > 0 && (
                    <section className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                      <h4 className="text-rose-900 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fas fa-triangle-exclamation text-rose-500"></i>
                        Real Talk: Watch for these!
                      </h4>
                      <ul className="space-y-2">
                        {result.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex gap-3 text-rose-800">
                            <i className="fas fa-circle-exclamation text-xs mt-1 text-rose-400"></i>
                            <span className="font-semibold">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Home Care & Comfort */}
                  <section>
                    <h4 className="text-teal-900 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <i className="fas fa-mug-hot text-teal-500"></i>
                      Vibes for Recovery at Home
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.homeCareSuggestions?.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                          <i className="fas fa-check-circle text-teal-400 mt-1"></i>
                          <span className="text-slate-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* General Info */}
                  <section>
                    <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <i className="fas fa-info-circle text-slate-400"></i>
                      The lowdown on what's happening
                    </h4>
                    <ul className="space-y-2">
                      {result.generalInformation.map((info, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-600 text-sm">
                          <span className="text-indigo-300">•</span>
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Questions for Doctor */}
                  <section className="bg-slate-50 rounded-xl p-5">
                    <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <i className="fas fa-stethoscope text-indigo-400"></i>
                      Check-in with a real Doctor
                    </h4>
                    <p className="text-xs text-slate-500 mb-3 italic">Seriously, go see someone. Ask them these:</p>
                    <div className="space-y-2">
                      {result.suggestedQuestionsForDoctor.map((q, idx) => (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm">
                          "{q}"
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
              <div ref={resultsEndRef} />
            </div>
          )}
        </div>
      </main>

      <EmergencyStrip />
    </div>
  );
};

export default App;
