import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLegalCases, getRrCases } from '../services/api';
import StatCard from '../components/common/StatCard';
import {
  Scale,
  Users,
  AlertOctagon,
  Building,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Home
} from 'lucide-react';

export default function LegalRrTracker({ onSelectProject }) {
  const { t } = useAuth();

  const [legalData, setLegalData] = useState(null);
  const [rrData, setRrData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('legal'); // 'legal' | 'rr'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [lData, rData] = await Promise.all([
          getLegalCases(),
          getRrCases()
        ]);
        setLegalData(lData);
        setRrData(rData);
      } catch (err) {
        console.error('Error loading legal and R&R data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Legal Disputes & R&R Resettlement Monitoring
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Judicial stays, Section 3G(5) arbitration petitions & Rehabilitation & Resettlement colony allotment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('legal')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'legal'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5 inline mr-1" />
            Judicial Litigations
          </button>
          <button
            onClick={() => setActiveSubTab('rr')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'rr'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-3.5 h-3.5 inline mr-1" />
            R&R Resettlement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {legalData && rrData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Active Judicial Stays"
            value={legalData.stayGrantedCases}
            icon={AlertOctagon}
            subtitle="Restraining survey or possession"
            variant="danger"
          />
          <StatCard
            title="Land Blocked by Stays"
            value={`${legalData.totalLandBlockedHa} Ha`}
            icon={Scale}
            subtitle="Chainage physically held up"
            variant="warning"
          />
          <StatCard
            title="Total Affected Families"
            value={rrData.totalAffectedFamilies}
            icon={Users}
            subtitle="Surveyed under Section 11/15"
            variant="default"
          />
          <StatCard
            title="Families Rehabilitated"
            value={`${rrData.rehabilitationRatePct}%`}
            icon={CheckCircle2}
            subtitle={`${rrData.familiesRehabilitated} families relocated`}
            variant="success"
          />
        </div>
      )}

      {/* SUB-TAB: LEGAL LITIGATIONS */}
      {activeSubTab === 'legal' && legalData && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Judicial Cases & Arbitration Petitions (Section 3G(5))
            </h3>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              Total Disputes: {legalData.totalDisputes}
            </span>
          </div>

          <div className="p-4 space-y-4">
            {legalData.cases?.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                  c.stayGranted ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-blue-950">{c.caseNumber}</span>
                    <span className="bg-white border border-slate-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                      {c.courtForum}
                    </span>
                  </div>

                  {c.stayGranted && (
                    <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                      INTERIM STAY ACTIVE &bull; {c.caseAgeDays} DAYS
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-500">Petitioner:</span> {c.petitioner}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Chainage Affected:</span> {c.chainageAffected} ({c.landBlockedHa} Ha blocked)
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Assigned Advocate:</span> {c.assignedAdvocate}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Next Hearing:</span> <strong className="font-mono text-slate-900">{c.nextHearingDate}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">
                    Current Proceeding Status: <strong>{c.status}</strong>
                  </span>
                  <button
                    onClick={() => onSelectProject(c.projectId)}
                    className="text-blue-900 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Project: {c.projectId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: R&R RESETTLEMENT */}
      {activeSubTab === 'rr' && rrData && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Rehabilitation & Resettlement (R&R) Family Beneficiary Roster
            </h3>
            <span className="text-xs font-mono text-emerald-800 font-bold">
              {rrData.colonyAllotmentRatePct}% Colony Allotment Complete
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {rrData.cases?.map((rr) => (
              <div key={rr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{rr.familyHead}</span>
                  {rr.bplStatus && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      BPL Family
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] font-medium">{rr.village}</p>

                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Entitlement</div>
                  <div className="font-medium text-blue-950">{rr.entitlementType}</div>
                  <div className="font-mono font-bold text-emerald-800 text-xs mt-1">
                    Grant: ₹{rr.cashGrant.toLocaleString()}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-500">Colony Site:</span> {rr.allottedColony}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                    {rr.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{rr.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
