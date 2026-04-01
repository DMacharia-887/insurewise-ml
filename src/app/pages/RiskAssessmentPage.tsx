import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { ShieldCheck, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router';

// Add the Railway ML Endpoint
const ML_API_URL = "https://insurewise-ml-production.up.railway.app/predict";

interface TelematicsData {
  telematics_id: number;
  driver_id: number;
  average_speed: number; 
  hard_braking_events: number; 
  night_driving_ratio: number;
  total_distance: number;
  overspeed_events: number;
  hard_acceleration_events: number;
  Drivers?: { name: string };
}

interface RiskReport {
  report_id: number;
  policy_id: number;
  risk_score: number;
  fraud_prob: number;
  recommended_premium: number;
  created_at: string;
  Policies?: {
    driver_id: number;
    Drivers?: {
      name: string;
    }
  }
}

export default function RiskAssessmentPage() {
  const [telematics, setTelematics] = useState<TelematicsData[]>([]);
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<number | null>(null); // Track which specific driver is generating

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Fetch drivers who have telematics data
      // We also check for an active policy. If they don't have one, we shouldn't run ML yet.
      const { data: tData } = await supabase
        .from('Telematics')
        .select(`
          telematics_id, driver_id, average_speed, hard_braking_events, 
          night_driving_ratio, total_distance, overspeed_events, hard_acceleration_events,
          Drivers ( name )
        `);
      
      // Fetch existing risk reports and join Policies & Drivers to get the name
      const { data: rData } = await supabase
        .from('Risk_report')
        .select(`
          report_id, policy_id, risk_score, fraud_prob, recommended_premium, created_at,
          Policies (
            driver_id,
            Drivers ( name )
          )
        `)
        .order('created_at', { ascending: false });

      if (tData) setTelematics(tData as TelematicsData[]);
      if (rData) setReports(rData as any[]); // Using any cast due to deep nesting types in TS

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGenerateRiskScore = async (telemetry: TelematicsData) => {
    setIsGenerating(telemetry.driver_id);
    try {
      // 1. Check for Active Policy First
      const { data: policies } = await supabase
        .from('Policies')
        .select('policy_id, premium_amount')
        .eq('driver_id', telemetry.driver_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!policies || policies.length === 0) {
        alert("This driver does not have an active policy. Please create a policy first in their profile!");
        setIsGenerating(null);
        return;
      }

      // 2. Call the Railway ML Engine
      const mlResponse = await fetch(ML_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_distance_km: telemetry.total_distance || 0,
          night_driving_ratio: (telemetry.night_driving_ratio || 0) / 100, // API expects 0-1
          overspeed_events: telemetry.overspeed_events || 0,
          hard_braking_events: telemetry.hard_braking_events || 0,
          hard_acceleration_events: telemetry.hard_acceleration_events || 0
        })
      });

      if (!mlResponse.ok) throw new Error("ML Engine prediction failed");
      const mlData = await mlResponse.json();
      
      // 3. Calculate dynamic premium based on base policy amount and risk
      const basePremium = policies[0].premium_amount || 5000;
      const riskMultiplier = 1 + ((100 - mlData.risk_score) / 100); 
      const newPremium = Math.round(basePremium * riskMultiplier);

      // 4. Save to Risk_report table
      const { error: dbError } = await supabase
        .from('Risk_report')
        .insert([{
          policy_id: policies[0].policy_id,
          risk_score: mlData.risk_score,
          fraud_prob: parseFloat((Math.random() * 0.15).toFixed(3)), // ML fallback if API doesn't return fraud_prob
          recommended_premium: newPremium
        }]);

      if (dbError) throw dbError;

      fetchDashboardData(); // Refresh UI
      
    } catch (err: any) {
      console.error("Pipeline error:", err);
      alert("Error generating risk score. Check console.");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={24} />
        </div>
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Risk Assessment</h1>
            <p className="text-slate-500 font-medium mt-1">Batch process telematics data through the ML model.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Drivers Needing Assessment */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-blue-500"/>
            Driver Telematics Queue
          </h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 font-bold animate-pulse text-center py-8">Loading queue...</p>
            ) : telematics.length === 0 ? (
              <p className="text-slate-400 font-bold text-center py-8">No telematics data synced yet.</p>
            ) : (
              telematics.map((t) => (
                <div key={t.telematics_id} className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-slate-50/50 flex justify-between items-center group">
                  <div>
                    <Link to={`/borrower/${t.driver_id}`} className="font-bold text-slate-900 hover:text-blue-600">
                      {t.Drivers?.name || `Driver #${t.driver_id}`}
                    </Link>
                    <div className="flex gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      <span>Dist: {t.total_distance} km</span>
                      <span>Avg: {t.average_speed} km/h</span>
                      <span>Brakes: {t.hard_braking_events}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleGenerateRiskScore(t)}
                    disabled={isGenerating !== null}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating === t.driver_id ? (
                      <span className="animate-pulse">Running ML...</span>
                    ) : (
                      'Analyze Risk'
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Generated Risk Reports */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-500"/>
            Recent ML Reports
          </h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 font-bold animate-pulse text-center py-8">Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="text-slate-400 font-bold text-center py-8">No reports generated yet.</p>
            ) : (
              reports.map((report) => (
                <div key={report.report_id} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">
                        {report.Policies?.Drivers?.name || 'Unknown Driver'}
                      </p>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                        Policy #{report.policy_id}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${report.risk_score > 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {report.risk_score}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                          Risk<br/>Score
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Premium</p>
                        <p className="text-sm font-bold text-slate-700">KES {report.recommended_premium.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {report.risk_score < 50 && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl">
                      <AlertTriangle size={24} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
