import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router';
import { ShieldCheck, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Successful login - redirect to Dashboard
      navigate('/');
      
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Left Side: Branding & Info (Hidden on very small screens) */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
                <ShieldCheck size={28} />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">Insure<span className="text-blue-500">wise</span></span>
            </div>
            
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              ML-Powered<br/>Fleet Telematics.
            </h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
              Real-time driving behavior analysis, automated risk scoring, and dynamic premium calculation for the modern insurer.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 mt-12">
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Activity size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Traccar API</span>
              </div>
              <p className="text-2xl font-black text-white">Live</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">ML Engine</span>
              </div>
              <p className="text-2xl font-black text-white">v4.2.1</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Only Header */}
          <div className="flex items-center gap-3 mb-10 md:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Insure<span className="text-blue-600">wise</span></span>
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-slate-500 font-medium mb-10">Please enter your credentials to access the dashboard.</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@insurewise.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1 mr-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group disabled:bg-blue-400 disabled:shadow-none"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    Sign In Securely
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs font-bold text-slate-400 mt-10">
              By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
