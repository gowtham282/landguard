import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Compass,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  FileCheck2,
  MapPin,
  AlertOctagon,
  Scale,
  Award,
  Layers,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function PortalGateway({ onNavigate }) {
  const { t, currentUser } = useAuth();

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Official Prototype Notification Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded tracking-wider uppercase">
            Official Demonstration
          </span>
          <span className="font-medium">
            National Land Acquisition Intelligence Platform &bull; Predictive Analytics System for Early Detection of Delays.
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-800 hidden md:inline">
          System Environment: Prototype / Simulated MoRTH & DoLR Interface
        </span>
      </div>

      {/* Institutional Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-50/80 to-transparent pointer-events-none"></div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-3 border border-blue-200">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-900" />
            <span>Southern Regional Land Acquisition Risk Surveillance (TN &bull; KL &bull; PY &bull; AP &bull; KA)</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight leading-tight">
            LandGuard AI
          </h1>
          <p className="text-base md:text-lg text-slate-700 font-medium mt-2 leading-relaxed">
            Transitioning government land acquisition monitoring across Tamil Nadu, Kerala, Puducherry, Andhra Pradesh, and Karnataka from reactive observation into proactive prediction:
            <span className="text-blue-900 font-bold block mt-1">
              "Predict &rarr; Explain &rarr; Locate &rarr; Alert &rarr; Recommend &rarr; Learn"
            </span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-lg bg-blue-950 text-white hover:bg-blue-900 font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Enter Executive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('gis')}
              className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4 text-blue-900" />
              <span>Open GIS Spatial Command Center</span>
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Browse 36 Southern Regional Corridors</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Paradigm Shift: Reactive vs Predictive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legacy Monitoring */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Existing Monitoring Systems (BhoomiRashi / LACRRIS)
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            "What is happening right now?"
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Traditional portals track milestone status and expenditure after delays have already occurred:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">&times;</span>
              <span>Delays are identified only after the statutory deadline expires.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">&times;</span>
              <span>Root causes (e.g. Title dispute vs PFMS KYC failure) remain opaque.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">&times;</span>
              <span>No algorithmic prescriptive interventions to unblock bottlenecks.</span>
            </li>
          </ul>
        </div>

        {/* LandGuard AI Innovation */}
        <div className="bg-blue-50/60 border-2 border-blue-300 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-900"></span>
            LandGuard AI Early Warning Paradigm
          </div>
          <h3 className="text-lg font-bold text-blue-950 mb-2">
            "What is likely to happen? Why? What should we do now?"
          </h3>
          <p className="text-xs text-blue-900 font-medium leading-relaxed mb-4">
            Proactively forecasts acquisition risks months before they derail construction timelines:
          </p>
          <ul className="space-y-2 text-xs text-blue-950 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
              <span><strong>Predict:</strong> Machine learning forecasts delay probability (e.g., 84.5%) and expected delay days.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
              <span><strong>Explain:</strong> TreeSHAP feature attributions pinpoint the exact bottleneck driver.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
              <span><strong>Recommend & Act:</strong> Prescriptive actions (e.g. Special Lok Adalat) with quantified days saved.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* The 6 Core Pillars */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            System Operational Architecture
          </h2>
          <p className="text-xs text-slate-600">
            End-to-end statutory decision-support aligned with the RFCTLARR Act 2013 and National Highways Act 1956.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              pillar: 'PREDICT',
              title: 'Delay Forecasting',
              desc: 'Identifies potential delays 60–180 days in advance across all 6 statutory stages.',
              icon: TrendingUp,
              color: 'border-blue-200 bg-white'
            },
            {
              pillar: 'EXPLAIN',
              title: 'Explainable AI (SHAP)',
              desc: 'Explains why a corridor is at risk with transparent positive & negative factor contribution.',
              icon: Sparkles,
              color: 'border-blue-200 bg-white'
            },
            {
              pillar: 'LOCATE',
              title: 'GIS Parcel Intelligence',
              desc: 'Maps project alignments, chainage bottlenecks, and individual disputed khata parcels.',
              icon: MapPin,
              color: 'border-blue-200 bg-white'
            },
            {
              pillar: 'ALERT',
              title: 'Automated Early Warning',
              desc: 'Triggers priority escalations to District Collectors and CALAs before stages lapse.',
              icon: AlertOctagon,
              color: 'border-blue-200 bg-white'
            },
            {
              pillar: 'RECOMMEND',
              title: 'Prescriptive Interventions',
              desc: 'Simulates what-if policy interventions with quantified days saved for authorized officers.',
              icon: FileCheck2,
              color: 'border-blue-200 bg-white'
            },
            {
              pillar: 'LEARN',
              title: 'Adaptive MLOps Governance',
              desc: 'Incorporates post-intervention outcomes to retrain gradient boosting models with zero drift.',
              icon: Award,
              color: 'border-blue-200 bg-white'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-lg border ${item.color} shadow-xs hover:border-blue-300 transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-mono">
                    {item.pillar}
                  </span>
                  <Icon className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statutory Alignment Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-900" />
          <span>Statutory Compliance & Legal Foundation</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-blue-950 mb-1">National Highways Act, 1956</div>
            <p className="text-slate-600 leading-relaxed">
              Full lifecycle tracking across Sections 3A (Intention), 3B (Survey), 3C (Hearing Objections), 3D (Declaration), 3G (Compensation Determination), and 3E (Possession).
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-blue-950 mb-1">RFCTLARR Act, 2013</div>
            <p className="text-slate-600 leading-relaxed">
              Strict governance of Social Impact Assessment (SIA), Preliminary Notification Sec 11, Rehabilitation & Resettlement Scheme Sec 19, and possession benchmarks.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-blue-950 mb-1">Southern Land Cadastres Integration</div>
            <p className="text-slate-600 leading-relaxed">
              Direct alignment with Tamil Nadu (Tamil Nilam: Patta / Chitta / FMB), Kerala (e-Rekha), Karnataka (Bhoomi: RTC / Pahani), Andhra Pradesh (Meebhoomi: Adangal / 1-B), and Puducherry Nilam records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
