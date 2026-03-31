import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { 
  ArrowLeft, MapPin, CheckCircle2, AlertTriangle, 
  Navigation, PlusCircle
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Keep hardcoded charts for now since we don't have historical day-by-day tables yet
const BEHAVIOR_HISTORY = [
  { day: 'Mon', speed: 12, braking: 2, cornering: 5 },
  { day: 'Tue', speed: 8, braking: 1, cornering: 3 },
  { day: 'Wed', speed: 15, braking: 4, cornering: 8 },
  { day: 'Thu', speed: 10, braking: 2, cornering: 4 },
  { day: 'Fri', speed: 22, braking: 7, cornering: 12 },
  { day: 'Sat', speed: 35, braking: 12, cornering: 15 },
  { day: 'Sun', speed: 18, braking: 5, cornering: 9 },
];

export default function BorrowerProfilePage() {
  const { id } = useParams();
  
  const [driver, setDriver] = useState<any>(null);
  const [policy, setPolicy] = useState<any>(null);
  const [riskReport, setRiskReport] = useState<any>(null);
  const [telematics, setTelematics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  // Form State for creating a new policy
  const [policyForm, setPolicyForm] = useState({
    coverage_type: 'Telematics UBI',
    premium_amount: '',
    status: 'Active'
  });

  async function fetchDriverData() {
    try {
      setLoading(true);
      
      // 1. Fetch Driver
      const { data: driverData, error: driverError } = await supabase
        .from('Drivers')
        .select('*')
        .eq('driver_id', id)
        .single(); // It's fine here because if the driver doesn't exist, the page shouldn't load anyway
        
      if (driverError) throw driverError;
      if (driverData) setDriver(driverData);

      // 2. Fetch their active policy using MAYBE SINGLE
      const { data: policyData, error: policyError } = await supabase
        .from('Policies')
        .select('*')
        .eq('driver_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // <--- FIX IS HERE
        
      if (policyData) {
        setPolicy(policyData);
        
        // 3. If they have a policy, fetch the latest risk report using MAYBE SINGLE
        const { data: riskData } = await supabase
          .from('Risk_report')
          .select('*')
          .eq('policy_id', policyData.policy_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(); // <--- FIX IS HERE
          
        if (riskData) setRiskReport(riskData);
      }

      // 4. Fetch Telematics averages using MAYBE SINGLE
      const { data: telematicsData } = await supabase
        .from('Telematics')
        .select('*')
        .eq('driver_id', id)
        .limit(1)
        .maybeSingle(); // <--- FIX IS HERE
        
      if (telematicsData) setTelematics(telematicsData);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchDriverData();
  }, [id]);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('Policies').insert([{
        driver_id: id,
        date_applied: new Date().toISOString().split('T')[0],
        coverage_type: policyForm.coverage_type,
        status: policyForm.status,
        premium_amount: parseFloat(policyForm.premium_amount)
      }]);
      
      if (error) throw error;
      alert("Policy created successfully!");
      setShowPolicyForm(false);
      fetchDriverData(); // Refresh page data
    } catch (err: any) {
      alert("Error saving policy: " + err.message);
    }
  };

  if (loading) return <div className="p-8 font-bold animate-pulse text-slate-400">Loading driver profile...</div>;
  if (!driver) return <div className="p-8 font-bold text-red-500">Driver not found in database.</div>;

  // Fallback values if no risk report is generated yet
  const score = riskReport?.risk_score || '--';
  const premium = riskReport?.recommended_premium ? `KES ${riskReport.recommended_premium.toLocaleString()}` : (policy?.premium_amount ? `KES ${policy.premium_amount.toLocaleString()}` : '--');
  const fraudProb = riskReport ? (riskReport.fraud_prob * 100).toFixed(1) : '--';
  const totalDist = telematics?.total_distance ? `${telematics.total_distance.toLocaleString()} km` : '--';
  const isSafe = riskReport ? riskReport.risk_score < 60 : true;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center justify-between">
         <Link to="/driver-management" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors group">
            <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm group-hover:border-blue-200">
               <ArrowLeft size={18} />
            </div>
            <span>Back to Drivers</span>
         </Link>
         <div className="flex gap-3">
            <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
               Download CSV
            </button>
            <button 
              onClick={() => setShowPolicyForm(!showPolicyForm)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
               {policy ? "Update Policy" : "Create Policy"}
            </button>
         </div>
      </div>

      {/* NEW POLICY FORM (Hidden by default) */}
      {showPolicyForm && (
        <form onSubmit={handleCreatePolicy} className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-200 flex items-end gap-4">
           <div className="flex-1">
             <label className="text-[10px] font-black text-slate-400 uppercase">Coverage</label>
             <select value={policyForm.coverage_type} onChange={e => setPolicyForm({...policyForm, coverage_type: e.target.value})} className="w-full mt-1 border p-2 rounded-xl bg-slate-50">
               <option>Telematics UBI</option>
               <option>Comprehensive</option>
               <option>Third Party</option>
             </select>
           </div>
           <div className="flex-1">
             <label className="text-[10px] font-black text-slate-400 uppercase">Premium (KES)</label>
             <input required type="number" value={policyForm.premium_amount} onChange={e => setPolicyForm({...policyForm, premium_amount: e.target.value})} className="w-full mt-1 border p-2 rounded-xl bg-slate-50" />
           </div>
           <button type="submit" className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 h-[42px]">
             Save to Supabase
           </button>
        </form>
      )}

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10">
         <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-xl",
              isSafe ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
               {driver.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-2xl shadow-lg border border-slate-100">
               {isSafe ? <CheckCircle2 className="text-green-500" size={24} /> : <AlertTriangle className="text-red-500" size={24} />}
            </div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">{driver.name}</h1>
               <div className={cn(
                 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                 isSafe ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
               )}>
                 {isSafe ? "Safe Driver" : "High Risk"}
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Score</p>
                  <p className="text-2xl font-black text-slate-900">{score}/100</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Set Premium</p>
                  <p className="text-2xl font-black text-slate-900">{premium}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fraud Prob</p>
                  <p className="text-2xl font-black text-slate-900">{fraudProb}%</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
                  <p className="text-2xl font-black text-slate-900">{totalDist}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            
            {/* CHARTS SECION */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Violation Analysis</h3>
                     <p className="text-sm font-medium text-slate-500 mt-1">Daily trend of detected driving anomalies</p>
                  </div>
               </div>
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={BEHAVIOR_HISTORY}>
                        <defs>
                           <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f8fafc'}} />
                        <Area type="monotone" dataKey="speed" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={3} />
                        <Area type="monotone" dataKey="braking" stroke="#3b82f6" fill="transparent" strokeWidth={3} />
                        <Area type="monotone" dataKey="cornering" stroke="#f59e0b" fill="transparent" strokeWidth={3} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Navigation size={20} className="text-blue-400" />
                  Trip History Map
               </h3>
               <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden flex items-center justify-center text-center p-8 group">
                  <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <div className="grid grid-cols-10 grid-rows-10 h-full w-full border border-white/10">
                        {Array.from({ length: 100 }).map((_, i) => (
                           <div key={i} className="border border-white/5" />
                        ))}
                     </div>
                  </div>
                  <div>
                     <MapPin className="text-blue-500 mx-auto mb-4 animate-bounce" size={32} />
                     <p className="text-sm font-bold text-slate-300">Live Telematics Visualizer</p>
                  </div>
               </div>
            </div>

            {/* REAL POLICY DETAILS FROM SUPABASE */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-black text-slate-900 mb-6">Database Policy Details</h3>
               <div className="space-y-4">
                 {policy ? (
                   <>
                    <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Policy ID</p>
                       <p className="text-sm font-bold text-slate-900">#{policy.policy_id}</p>
                    </div>
                    <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coverage</p>
                       <p className="text-sm font-bold text-slate-900">{policy.coverage_type}</p>
                    </div>
                    <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Applied</p>
                       <p className="text-sm font-bold text-slate-900">{new Date(policy.date_applied).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <p className="text-sm font-bold text-slate-900">{policy.status}</p>
                    </div>
                   </>
                 ) : (
                   <p className="text-sm text-slate-400 text-center py-4">No policy assigned yet. Click "Create Policy" above.</p>
                 )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
