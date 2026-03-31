import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { ShieldCheck, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

interface TelematicsData {
  telematics_id: number;
  driver_id: number;
  avg_speed: number;
  harsh_breaks: number;
  night_driving: number;
  total_distance: number;
  Drivers?: { name: string };
}

interface RiskReport {
  report_id: number;
  policy_id: number;
  risk_score: number;
  fraud_prob: number;
  recommended_premium: number;
  created_at: string;
}

export default function RiskAssessmentPage() {
  const [telematics, setTelematics] = useState<TelematicsData[]>([]);
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      // Fetch drivers who have telematics data
      const { data: tData } = await supabase
        .from('Telematics')
        .select('*, Drivers(name)');
      
      // Fetch existing risk reports
      const { data: rData } = await supabase
        .from('Risk_report')
        .select('*')
        .order('created_at', { ascending: false });

      if (tData) setTelematics(tData as TelematicsData[]);
      if (rData) setReports(rData as RiskReport[]);
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
    setIsGenerating(true);
    try {
      // 1. Send data to your Python FastAPI ML Engine
      const response = await fetch('http://localhost:8000/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avg_speed: telemetry.avg_speed,
          total_distance: telemetry.total_distance,
          harsh_breaks: telemetry.harsh_breaks,
          night_driving: telemetry.night_driving
        })
      });

      if (!response.ok) throw new Error("ML Engine prediction failed");
      
      const mlResult = await response.json();

      // 2. We need a policy_id to save this report. 
      // For this demo, we'll fetch the first active policy for this driver.
      const { data: policies } = await supabase
        .from('Policies')
        .select('policy_id')
        .eq('driver_id', telemetry.driver_id)
        .limit(1);

      if (!policies || policies.length === 0) {
        alert("This driver does not have an active policy. Please create a policy first!");
        setIsGenerating(false);
        return;
      }

      // 3. Save the ML prediction into the Supabase Risk_report table
      const { error: dbError } = await supabase
        .from('Risk_report')
        .insert([{
          policy_id: policies[0].policy_id,
          risk_score: mlResult.risk_score,
          fraud_prob: mlResult.fraud_prob,
          recommended_premium: mlResult.recommended_premium
        }]);

      if (dbError) throw dbError;

      alert(`Success! Risk Score Generated: ${mlResult.risk_score}\nCategory: ${mlResult.risk_category}`);
      fetchDashboardData(); // Refresh the list
      
    } catch (err: any) {
      console.error("Pipeline error:", err);
      alert("Error generating risk score. Is your Python API running?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
        </div>
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Risk Assessment</h1>
            <p className="text-slate-500 font-medium">Generate ML-driven scores using telematics data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Drivers Needing Assessment */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-blue-500"/>
            Pending ML Assessments
          </h3>
          <div className="space-y-4">
            {loading ? <p>Loading...</p> : telematics.map((t) => (
              <div key={t.telematics_id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{t.Drivers?.name || `Driver ID: ${t.driver_id}`}</p>
                  <p className="text-xs text-slate-500">Speed: {t.avg_speed} km/h | Breaks: {t.harsh_breaks}</p>
                </div>
                <button 
                  onClick={() => handleGenerateRiskScore(t)}
                  disabled={isGenerating}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors disabled:bg-slate-300"
                >
                  {isGenerating ? 'Analyzing...' : 'Run ML Model'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Risk Reports */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-500"/>
            Completed Risk Reports
          </h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.report_id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-white shadow-sm">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Policy #{report.policy_id}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className={`text-2xl font-black ${report.risk_score > 60 ? 'text-red-600' : 'text-green-600'}`}>
                      {report.risk_score}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Premium: KES {report.recommended_premium.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Fraud Prob: {(report.fraud_prob * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                {report.risk_score > 60 && <AlertTriangle className="text-red-500" />}
              </div>
            ))}
            {reports.length === 0 && !loading && (
              <p className="text-slate-400 text-center py-8">No reports generated yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
