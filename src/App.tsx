import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Terminal, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Linkedin, 
  Github, 
  Mail, 
  Sparkles,
  Camera,
  Trophy,
  History,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithDanE } from './services/geminiService';
import { resumeData } from './services/resumeData';
import { cn } from './lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "SYSTEM_ACCESS_GRANTED. I am Dan-E, your professional interface for Daniel Mathew Ranjan's professional record. How can I assist you with data integration, AI research, or my work history?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'experience' | 'skills' | 'achievements'>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Restore scroll
    }
  }, [isMobileMenuOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await chatWithDanE([...messages, userMessage]);
    
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsTyping(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-dvh w-full flex flex-col bg-brand-dark overflow-hidden selection:bg-brand-blue/30 selection:text-white">
      {/* SCANLINE EFFECT */}
      <div className="scanline z-[100] pointer-events-none" />

      {/* MOBILE MENU OVERLAY - Z-INDEX 9999 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9998] bg-[#020617] flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <Cpu size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-white">DAN-E</h1>
              </div>
              <button 
                onClick={closeMenu}
                className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full text-slate-400 active:scale-95 transition-transform"
                title="Close Menu"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-4 mb-10">
              <div className="label text-brand-blue px-2 font-black tracking-[0.2em]">SYSTEM_PROTOCOLS</div>
              <nav className="space-y-2">
                <MobileMenuButton 
                  active={activeView === 'chat'} 
                  onClick={() => { setActiveView('chat'); closeMenu(); }} 
                  label="Interactive Terminal" 
                  icon={<Terminal size={20} />} 
                />
                <MobileMenuButton 
                  active={activeView === 'experience'} 
                  onClick={() => { setActiveView('experience'); closeMenu(); }} 
                  label="Professional Record" 
                  icon={<Briefcase size={20} />} 
                />
                <MobileMenuButton 
                  active={activeView === 'skills'} 
                  onClick={() => { setActiveView('skills'); closeMenu(); }} 
                  label="Expertise Stack" 
                  icon={<Layers size={20} />} 
                />
                <MobileMenuButton 
                  active={activeView === 'achievements'} 
                  onClick={() => { setActiveView('achievements'); closeMenu(); }} 
                  label="Verified Awards" 
                  icon={<Trophy size={20} />} 
                />
              </nav>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="label text-brand-blue px-2 mb-4">External Uplinks</div>
              <div className="grid grid-cols-2 gap-3">
                <a href={resumeData.personalInfo.photography} target="_blank" className="flex flex-col items-center justify-center gap-2 p-4 bg-brand-surface border border-white/5 text-slate-300 min-h-[44px] hover:border-brand-blue transition-colors">
                  <Camera size={20} /> <span className="text-[9px] font-black uppercase tracking-widest">Photography</span>
                </a>
                <a href={resumeData.personalInfo.spotify} target="_blank" className="flex flex-col items-center justify-center gap-2 p-4 bg-brand-surface border border-white/5 text-slate-300 min-h-[44px] hover:border-brand-blue transition-colors">
                  <Activity size={20} /> <span className="text-[9px] font-black uppercase tracking-widest">Spotify</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER - COMMAND BAR */}
      <header className="h-16 md:h-20 border-b border-white/5 px-4 md:px-8 flex items-center justify-between glass-accent z-[9999] shrink-0 sticky top-0">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden w-12 h-12 flex items-center justify-center bg-brand-blue/10 border border-brand-blue/20 text-brand-blue active:scale-90 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.1)]"
            title="Open Menu"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-blue flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Cpu size={18} className="md:hidden text-white" />
              <Cpu size={24} className="hidden md:block text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none mb-0.5 md:mb-1">DAN-E</h1>
              <div className="label !mb-0 font-mono text-[7px] md:text-[9px]">PERSONA_V3.5</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden lg:block" />
          
          <div className="hidden lg:flex items-center gap-8">
            <MetricStat label="GEN_AI_RAG" value="95%" color="text-blue-400" />
            <MetricStat label="MBA_CGPA" value="9.0/10" color="text-yellow-400 font-bold" />
            <MetricStat label="TCS_TENURE" value="3+ YRS" color="text-green-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-green-500/10 border border-green-500/20 rounded-sm">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="text-[8px] md:text-[10px] font-mono text-green-500 tracking-widest font-bold uppercase transition-colors">Stable_Node</span>
          </div>
          <div className="text-right">
            <div className="label !mb-0 hidden md:block">EXPERIENCE_QUOTA</div>
            <div className="text-base md:text-lg font-black leading-none text-white">2021-2026+</div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col grid grid-cols-1 lg:grid lg:grid-cols-12 overflow-hidden bg-white/5 relative h-full">
        
        {/* SIDEBAR - HIDDEN ON MOBILE/TABLET, SHOWN ON LARGE SCREEN */}
        <aside className="hidden lg:flex lg:col-span-4 bg-brand-surface flex-col overflow-y-auto custom-scrollbar border-r border-white/5">
          {/* IDENTITY SECTION */}
          <section className="p-8 border-b border-white/5 bg-brand-dark/30">
            <div className="label">Identity Matrix</div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-1">Daniel Mathew Ranjan</h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Data Analyst & GenAI Specialist. Bridging the gap between technical engineering and leadership through an MBA in AI & Data Science at SRM IST.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <IconData icon={<Mail size={14} />} label="Uplink" value={resumeData.personalInfo.email} small />
                <IconData icon={<Zap size={14} />} label="Current" value="MBA AI & DS" />
              </div>
            </div>
          </section>

          {/* NAVIGATION PROTOCOLS */}
          <section className="p-8 border-b border-white/5">
            <div className="label">Navigation Protocols</div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <NavButton 
                active={activeView === 'chat'} 
                onClick={() => setActiveView('chat')} 
                label="Interactive Terminal" 
                icon={<Terminal size={16} />} 
              />
              <NavButton 
                active={activeView === 'experience'} 
                onClick={() => setActiveView('experience')} 
                label="Professional Record" 
                icon={<Briefcase size={16} />} 
              />
              <NavButton 
                active={activeView === 'skills'} 
                onClick={() => setActiveView('skills')} 
                label="Expertise Stack" 
                icon={<Layers size={16} />} 
              />
              <NavButton 
                active={activeView === 'achievements'} 
                onClick={() => setActiveView('achievements')} 
                label="Verified Awards" 
                icon={<Trophy size={16} />} 
              />
            </div>
          </section>

          {/* SUB-PROCESSES */}
          <section className="p-8">
            <div className="label text-brand-blue mb-4 uppercase tracking-[0.2em] font-black text-[10px]">Expertise_Sub_Nodes</div>
            <div className="space-y-6">
              <a href={resumeData.personalInfo.photography} target="_blank" className="block outline-none group">
                <ProcessItem icon={<Camera size={16} />} title="Visual Storytelling" detail="PhotographyCommunity.org/ID_343180" />
              </a>
              <a href={resumeData.personalInfo.spotify} target="_blank" className="block outline-none group">
                <ProcessItem icon={<Activity size={16} />} title="Sonic Optimization" detail="Spotify.Intelligence_Stream_V8" />
              </a>
              <div className="pt-6 flex gap-6 text-slate-500 border-t border-white/5 mt-6">
                <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" className="hover:text-brand-blue transition-colors"><Linkedin size={24} /></a>
                <a href={`https://${resumeData.personalInfo.github}`} target="_blank" className="hover:text-white transition-colors"><Github size={24} /></a>
              </div>
            </div>
          </section>
        </aside>

        {/* MAIN PROCESSING UNIT (8 COLUMNS ON DESKTOP, FULL ON MOBILE) */}
        <section className="flex-1 lg:col-span-8 bg-[#01040f] flex flex-col overflow-hidden relative">
          
          <div className="flex-1 px-4 py-4 md:p-10 flex flex-col overflow-hidden relative">
            {/* MOBILE SECTION LABEL */}
            <div className="lg:hidden flex items-center justify-between mb-4 pb-2 border-b border-white/5 shrink-0">
               <span className="mono text-[10px] text-brand-blue font-black tracking-[0.25em]">{activeView.toUpperCase()}_MPU_V_2026</span>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                 <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Live_Feed_Active</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 pr-1 custom-scrollbar pb-32 lg:pb-12">
              <AnimatePresence mode="wait">
                {activeView === 'chat' ? (
                  <motion.div 
                    key="chat-view" 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 md:space-y-8 pb-4"
                  >
                    {messages.map((msg, i) => (
                      <div key={i} className={cn("flex flex-col gap-1.5 md:gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                        <div className="flex items-center gap-2 px-2">
                           <span className={cn(
                             "mono text-[8px] font-bold uppercase tracking-widest",
                             msg.role === 'user' ? 'text-brand-blue' : 'text-slate-500'
                           )}>
                             {msg.role === 'user' ? 'USER_ACCESS_GRANTED' : 'DAN_E_CORE_RESPONSE'}
                           </span>
                        </div>
                        <div className={msg.role === 'user' ? "chat-bubble-user" : "chat-bubble-model"}>
                          <div className="prose prose-invert prose-slate text-sm md:text-base max-w-none prose-p:leading-relaxed prose-li:my-1">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={scrollRef} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="data-view" 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 md:space-y-12 pb-10"
                  >
                    {activeView === 'experience' && (
                      <div className="space-y-12 md:space-y-16">
                        {resumeData.workExperience.map((job, idx) => (
                          <div key={idx} className="group relative border-l border-white/5 pl-6 md:pl-8">
                            <div className="absolute left-[-1px] top-0 w-[2px] h-10 bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                               <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter group-hover:text-brand-blue transition-colors uppercase leading-tight">{job.role}</h3>
                               <span className="mono text-brand-blue font-bold tracking-[0.2em] text-[10px] md:text-xs mt-2 md:mt-0 bg-brand-blue/10 px-2 py-0.5 rounded-sm">{job.period}</span>
                            </div>
                            <div className="text-xs md:text-base font-bold text-slate-300 mb-6 flex items-center gap-2">
                               <div className="p-1 px-2 bg-slate-800 text-[10px] md:text-xs tracking-widest uppercase border border-white/5">{job.company}</div>
                               <span className="text-slate-600 text-[10px]">|</span>
                               <span className="text-slate-400 text-[10px] uppercase tracking-widest">{job.domain || 'LSHC'}</span>
                            </div>
                            <ul className="space-y-4 md:space-y-5">
                              {job.highlights.map((h, i) => (
                                <li key={i} className="text-sm md:text-base text-slate-400 leading-relaxed pl-6 relative before:content-['>'] before:absolute before:left-0 before:text-brand-blue before:font-mono before:text-xs before:top-0.5">
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* RESEARCH SECTION */}
                        <div className="pt-12 border-t border-white/5 mt-12">
                           <div className="label text-brand-blue text-xs mb-8 flex items-center gap-3">
                             <div className="w-8 h-1 bg-brand-blue" />
                             RESEARCH_PUBLICATIONS_GRID
                           </div>
                           {resumeData.publications?.map((pub, i) => (
                             <div key={i} className="p-6 md:p-10 bg-brand-blue/5 border border-white/5 relative overflow-hidden group">
                               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl rounded-full" />
                               <div className="relative z-10">
                                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                   <h4 className="text-lg md:text-2xl font-black text-white tracking-tight uppercase leading-tight max-w-2xl">{pub.title}</h4>
                                   <div className="flex flex-col items-end shrink-0">
                                     <span className="text-[10px] md:text-[11px] bg-brand-blue text-white px-3 py-1 font-black uppercase tracking-[0.2em]">{pub.publisher}</span>
                                     <span className="text-[9px] text-slate-500 font-mono mt-2">D_ID: IEEE_9528165</span>
                                   </div>
                                 </div>
                                 <div className="flex items-center gap-4 mb-8">
                                    <div className="flex flex-col">
                                      <span className="label !mb-0 text-[8px]">Confidence_Metric</span>
                                      <span className="text-brand-blue font-black text-xl">{pub.accuracy}</span>
                                    </div>
                                    <div className="h-10 w-px bg-white/10" />
                                    <div className="flex flex-col">
                                      <span className="label !mb-0 text-[8px]">Subject_Matter</span>
                                      <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">Machine Vision / AI</span>
                                    </div>
                                 </div>
                                 <a 
                                   href={pub.link} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center gap-3 px-6 py-4 bg-brand-blue hover:bg-brand-accent transition-all text-[11px] font-black uppercase tracking-[0.25em] text-white min-h-[48px] shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
                                 >
                                   Access Source <Globe size={16} />
                                 </a>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {activeView === 'skills' && (
                      <div className="space-y-12 md:space-y-16">
                        <div>
                          <div className="label text-brand-blue border-b border-brand-blue/20 pb-2 mb-6 md:mb-8">Expertise Domains</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {resumeData.expertise.map(s => (
                              <div key={s} className="bg-white/5 p-4 md:p-6 border border-white/5 hover:border-brand-blue/30 transition-all flex items-center justify-between group">
                                <span className="text-[11px] md:text-sm font-bold text-slate-200 uppercase tracking-tight leading-tight">{s}</span>
                                <Zap size={14} className="text-slate-700 group-hover:text-brand-blue transition-all shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="label text-indigo-400 border-b border-indigo-400/20 pb-2 mb-6 md:mb-8">Verifiable Certifications</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {resumeData.certifications.map(c => (
                              <div key={c.name} className="p-3 md:p-4 bg-brand-dark/50 border border-white/5 flex flex-col h-full hover:bg-slate-900 transition-colors">
                                <span className="mono text-[7px] md:text-[8px] text-indigo-400 mb-1">{c.year}</span>
                                <h4 className="text-[10px] md:text-[11px] font-black text-slate-100 leading-tight flex-1">{c.name}</h4>
                                <span className="text-[9px] text-slate-500 mt-3 font-medium">{c.institute}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeView === 'achievements' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                         {resumeData.achievements.map((a, i) => (
                           <div key={i} className="p-4 md:p-6 bg-slate-900/50 border border-white/5 flex flex-col gap-3 group hover:border-brand-blue/50 transition-all">
                             <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                               <Sparkles size={16} />
                             </div>
                             <p className="text-[11px] md:text-xs text-slate-300 font-semibold leading-relaxed uppercase tracking-tight italic">
                               {a}
                             </p>
                           </div>
                         ))}
                       </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MESSAGE INPUT CARRIER - CHAT MODE ONLY */}
            <AnimatePresence>
              {activeView === 'chat' && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="shrink-0 mt-auto sticky bottom-0 z-30 pb-2 md:pb-0"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-brand-blue/30 blur opacity-0 group-focus-within:opacity-100 transition-opacity rounded-sm" />
                    <div className="relative flex">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="ENTER_SYSTEM_QUERY..."
                        className="flex-1 bg-[#050811] border border-white/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 rounded-none py-4 md:py-6 px-4 md:px-8 text-sm md:text-base font-mono placeholder:text-slate-700 outline-none transition-all text-slate-100 min-h-[56px] md:min-h-[64px]"
                      />
                      <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="w-16 md:w-24 bg-brand-blue hover:bg-brand-accent disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center transition-all shadow-lg active:scale-95 min-h-[56px] md:min-h-[64px] shrink-0"
                        title="Send Query"
                      >
                        <Send size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* MOBILE BOTTOM NAVIGATION - PERSISTENT FOR ACTIONS */}
      <nav className="lg:hidden h-20 border-t border-white/10 glass-accent flex items-center justify-around px-2 z-40 shrink-0 sticky bottom-0 pb-[safe-area-inset-bottom]">
         <MobileNavItem active={activeView === 'chat'} onClick={() => setActiveView('chat')} icon={<Terminal size={24} />} label="Terminal" />
         <MobileNavItem active={activeView === 'experience'} onClick={() => setActiveView('experience')} icon={<Briefcase size={24} />} label="Record" />
         <MobileNavItem active={activeView === 'skills'} onClick={() => setActiveView('skills')} icon={<Layers size={24} />} label="Stack" />
         <MobileNavItem active={activeView === 'achievements'} onClick={() => setActiveView('achievements')} icon={<Trophy size={24} />} label="Awards" />
      </nav>

      {/* FOOTER BAR (DESKTOP ONLY) */}
      <footer className="hidden lg:flex h-14 border-t border-white/5 px-8 items-center justify-between glass-accent z-40 shrink-0">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <div className="flex flex-col">
               <span className="label !mb-0 font-mono text-[7px] text-slate-500">Current Protocol</span>
               <span className="mono text-[9px] text-slate-300">SECURE_PERSONA_CONSULTATION</span>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <div className="flex flex-col">
               <span className="label !mb-0 font-mono text-[7px] text-slate-500">Status</span>
               <span className="mono text-[9px] text-brand-blue tracking-widest font-bold uppercase">Chat Mode Ready</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase">Source: Verified Record v2026</span>
           <div className="h-4 w-px bg-white/10" />
           <span className="mono text-[10px] text-slate-600 uppercase">© 2026 DAN-E</span>
        </div>
      </footer>
    </div>
  );
}

function MetricStat({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex flex-col">
      <span className="label !mb-0 font-mono text-[8px] tracking-widest">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-sm font-black", color)}>{value}</span>
        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: value }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn("h-full", color.replace('text', 'bg'))} 
          />
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex flex-col items-center justify-center h-full px-2 relative flex-1 min-h-[48px] touch-manipulation",
        active ? "text-brand-blue bg-brand-blue/5" : "text-slate-500"
      )}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter mt-1">{label}</span>
      {active && <motion.div layoutId="mobile-nav-indicator" className="absolute top-0 w-full h-1 bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
    </button>
  );
}

function MobileMenuButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-5 transition-all text-left outline-none min-h-[56px] touch-manipulation border-b border-white/5",
        active 
          ? "bg-brand-blue/10 text-white" 
          : "bg-transparent text-slate-400 hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-5">
        <span className={cn(active ? "text-brand-blue" : "text-slate-600")}>{icon}</span>
        <span className="text-sm font-black uppercase tracking-tight">{label}</span>
      </div>
      <ChevronRight size={16} className={cn("transition-transform", active ? "text-brand-blue translate-x-1" : "text-slate-800")} />
    </button>
  );
}

function IconData({ icon, label, value, small = false }: { icon: React.ReactNode, label: string, value: string, small?: boolean }) {
  return (
    <div className="p-3 bg-white/5 border border-white/5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-slate-500">{icon}</span>
        <span className="label !mb-0 text-[8px]">{label}</span>
      </div>
      <div className={cn("font-bold text-slate-200 truncate", small ? "text-[10px]" : "text-xs")}>{value}</div>
    </div>
  );
}

function NavButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between p-4 transition-all text-left outline-none relative overflow-hidden min-h-[48px]",
        active 
          ? "bg-brand-blue/5 border-l-4 border-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.05)]" 
          : "bg-transparent border-l-4 border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <span className={cn("transition-colors", active ? "text-brand-blue" : "text-slate-600 group-hover:text-slate-400")}>{icon}</span>
        <span className="text-xs font-black uppercase tracking-tight">{label}</span>
      </div>
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-brand-blue/10 pointer-events-none"
        />
      )}
    </button>
  );
}

function ProcessItem({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 w-8 h-8 flex-shrink-0 flex items-center justify-center border border-white/10 text-slate-500 group-hover:border-brand-blue group-hover:text-brand-blue transition-all">
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{title}</div>
        <div className="text-[10px] text-slate-500 font-medium leading-none mt-1">{detail}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-2">
         <span className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest">DAN_E_PROCESSING</span>
         <div className="chat-bubble-model flex items-center gap-2 py-4">
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ repeat: Infinity, duration: 1 }}
               className="w-1.5 h-1.5 bg-brand-blue" 
            />
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
               className="w-1.5 h-1.5 bg-brand-blue" 
            />
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
               className="w-1.5 h-1.5 bg-brand-blue" 
            />
         </div>
      </div>
    </div>
  );
}
