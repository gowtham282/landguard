import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecommendations, recordRecommendationDecision } from '../services/api';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
  AlertCircle,
  FileCheck2,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function RecommendationEngine({ onSelectProject }) {
  const { currentUser, t } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations();
      setRecommendations(data.items || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await recordRecommendationDecision(id, {
        decision,
        officialName: currentUser.name,
        officialRole: currentUser.role,
        remarks: `Official statutory endorsement: ${decision} by ${currentUser.name}`
      });
      fetchRecs();
    } catch (err) {
      console.error('Error recording recommendation decision:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Prescriptive Recommendation Engine
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Algorithmic interventions with simulated schedule recovery & statutory authority mapping
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded border border-emerald-300">
            Avg Delay Reduction: ~48 Days
          </span>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0" />
        <span className="font-semibold">
          Statutory Safeguard: AI-generated recommendations are advisory in nature. Final administrative and judicial decisions rest with the authorized District Collector / Competent Authority (CALA) under the RFCTLARR Act 2013 and National Highways Act 1956.
        </span>
      </div>

      {/* Recommendations Feed */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isApproved = rec.status.includes('APPROVED');
          return (
            <div
              key={rec.id}
              className={`bg-white rounded-xl border p-5 shadow-xs space-y-4 transition-all ${
                isApproved ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-500">{rec.id}</span>
                  <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded font-mono">
                    {rec.riskCategory}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                    -{rec.predictedDelayReductionDays} Days Estimated Recovery
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rec.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {rec.rationale}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Competent Statutory Authority</span>
                  <span className="font-semibold text-slate-900">{rec.competentAuthority}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Statutory Action Type</span>
                  <span className="font-mono text-slate-800">{rec.actionType}</span>
                </div>
              </div>

              {rec.officerRemarks && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950">
                  <span className="font-bold block text-[10px] uppercase text-emerald-800 mb-0.5">Official Administrative Record</span>
                  {rec.officerRemarks} &mdash; <span className="font-semibold">{rec.assignedTo}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => onSelectProject(rec.projectId)}
                  className="text-blue-900 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Associated Project: {rec.projectId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-2">
                  {!isApproved && (
                    <>
                      <button
                        onClick={() => handleDecision(rec.id, 'ASSIGN_FOR_INQUIRY')}
                        className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Assign for Revenue Inquiry
                      </button>
                      <button
                        onClick={() => handleDecision(rec.id, 'APPROVE')}
                        className="px-3.5 py-1.5 rounded bg-blue-900 text-white hover:bg-blue-950 font-bold text-xs shadow-xs transition-colors"
                      >
                        Endorse & Schedule Intervention
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
