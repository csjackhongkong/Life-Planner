/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Sparkles, 
  Target, 
  Calendar, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Brain,
  Clock,
  User,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface LifePlan {
  vision: string;
  goals: {
    title: string;
    description: string;
    timeframe: string;
  }[];
  routine: {
    time: string;
    activity: string;
    purpose: string;
  }[];
  habits: {
    name: string;
    frequency: string;
    tip: string;
  }[];
  growthMindset: string;
}

// --- AI Service ---

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const generatePlan = async (formData: {
  name: string;
  focus: string;
  challenges: string;
  goals: string;
  schedule: string;
}): Promise<LifePlan> => {
  const prompt = `
    Create a comprehensive, personalized life plan for ${formData.name}.
    Focus Area: ${formData.focus}
    Current Challenges: ${formData.challenges}
    Primary Goals: ${formData.goals}
    Current Daily Schedule: ${formData.schedule}

    The plan should be inspiring, practical, and structured.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vision: { type: Type.STRING, description: "A powerful vision statement for their life." },
          goals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                timeframe: { type: Type.STRING }
              },
              required: ["title", "description", "timeframe"]
            }
          },
          routine: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                purpose: { type: Type.STRING }
              },
              required: ["time", "activity", "purpose"]
            }
          },
          habits: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                frequency: { type: Type.STRING },
                tip: { type: Type.STRING }
              },
              required: ["name", "frequency", "tip"]
            }
          },
          growthMindset: { type: Type.STRING, description: "A specific growth mindset advice." }
        },
        required: ["vision", "goals", "routine", "habits", "growthMindset"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as LifePlan;
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Plans', href: '#planner' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <nav 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500 ease-out
        ${isScrolled ? 'top-2' : 'top-6'}
      `}
    >
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-2xl transition-all duration-500
        ${isScrolled ? 'bg-black/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]' : 'bg-white/5 shadow-xl'}
        before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50
      `}>
        {/* Liquid Glass Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="px-6 md:px-8 h-16 md:h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <Brain className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              AI Life Planner
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
            <div className="w-px h-6 bg-white/10 mx-4" />
            <button className="px-6 py-2.5 bg-white text-black rounded-xl hover:bg-indigo-50 transition-all font-bold text-sm shadow-lg shadow-white/5 active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-black/20 backdrop-blur-3xl overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-white/70 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    {link.name}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
                <button className="mt-4 w-full py-4 bg-white text-black rounded-2xl font-bold text-lg">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="relative pt-48 pb-32 px-6 overflow-hidden">
    {/* Dynamic Atmospheric Background */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[140px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-violet-600/20 blur-[140px] rounded-full" 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
    </div>

    <div className="max-w-6xl mx-auto text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          The Future of Intentional Living
        </span>
        
        <h1 className="text-7xl md:text-[120px] font-extrabold tracking-tighter text-white mb-10 leading-[0.85] uppercase">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
            Evolution
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
          Stop drifting through days. Harness the power of AI to architect a life of purpose, precision, and peak performance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="relative flex items-center gap-3">
              Begin Your Journey
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button className="group px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
            Explore Blueprint
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">12k+</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Lives Optimized</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">98%</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Goal Success</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">24/7</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">AI Mentorship</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">4.9/5</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">User Rating</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const PlanForm = ({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    name: '',
    focus: 'Career & Growth',
    challenges: '',
    goals: '',
    schedule: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section id="planner" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Tell us about your journey</h2>
            <p className="text-white/50">The more detail you provide, the better your AI plan will be.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" /> Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Alex Johnson"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4" /> Primary Focus
                </label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                >
                  <option className="bg-zinc-900">Career & Growth</option>
                  <option className="bg-zinc-900">Health & Fitness</option>
                  <option className="bg-zinc-900">Relationships</option>
                  <option className="bg-zinc-900">Mental Well-being</option>
                  <option className="bg-zinc-900">Financial Freedom</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" /> Current Challenges
              </label>
              <textarea
                required
                placeholder="What's holding you back right now?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px]"
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Top 3 Goals
              </label>
              <textarea
                required
                placeholder="What do you want to achieve in the next 6 months?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px]"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Typical Daily Schedule
              </label>
              <textarea
                required
                placeholder="Briefly describe your current morning, afternoon, and evening."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px]"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Architecting Your Future...
                </>
              ) : (
                <>
                  Generate My Life Plan
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const PlanDisplay = ({ plan, onReset }: { plan: LifePlan, onReset: () => void }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Your Personalized Blueprint</h2>
            <p className="text-white/50">A strategic roadmap for your evolution.</p>
          </div>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        </div>

        {/* Vision Section */}
        <div className="mb-12 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-[32px] p-8 md:p-12">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-[0.2em] mb-4">Core Vision</h3>
          <p className="text-2xl md:text-3xl font-medium text-white italic leading-relaxed">
            "{plan.vision}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Strategic Goals</h3>
            </div>
            {plan.goals.map((goal, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white">{goal.title}</h4>
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                    {goal.timeframe}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{goal.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Routine Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Daily Protocol</h3>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {plan.routine.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-5 flex gap-4 ${idx !== plan.routine.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="text-sm font-mono text-violet-400 whitespace-nowrap pt-1">{item.time}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{item.activity}</h4>
                    <p className="text-xs text-white/50">{item.purpose}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Habits & Growth Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Micro-Habits</h3>
              </div>
              {plan.habits.map((habit, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white text-sm">{habit.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-medium">{habit.frequency}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/60 italic">"{habit.tip}"</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">Mindset Shift</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed italic">
                {plan.growthMindset}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Brain className="text-indigo-500 w-5 h-5" />
        <span className="text-lg font-bold text-white">AI Life Planner</span>
      </div>
      <p className="text-white/40 text-sm">
        © 2026 AI Life Planner. Built with Gemini 3 Flash.
      </p>
      <div className="flex gap-6 text-white/40 text-sm">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Support</a>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<LifePlan | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const result = await generatePlan(formData);
      setPlan(result);
      // Scroll to top of plan
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Something went wrong while architecting your plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <main>
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onStart={handleStart} />
              <div ref={plannerRef}>
                <PlanForm onSubmit={handleGenerate} isLoading={isGenerating} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <PlanDisplay plan={plan} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
