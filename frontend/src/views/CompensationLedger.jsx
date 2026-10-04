import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCompensationOverview, getCompensationCases, disburseCompensationBatch } from '../services/api';
import StatCard from '../components/common/StatCard';
import {
  CreditCard,
  LandPlot,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowUpRight,
  Download,
  Filter,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function CompensationLedger({ onSelectProject }) {
  const { currentUser, t } = useAuth();

  const [overview, setOverview] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disbursing, setDisbursing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovData, casesData] = await Promise.all([
        getCompensationOverview(),
        getCompensationCases()
      ]);
      setOverview(ovData);
      setCases(casesData.items || []);
    } catch (err) {
      console.error('Error loading compensation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDisburseBatch = async () => {
    setDisbursing(true);
    try {
      await disburseCompensationBatch({
        batchId: `BATCH-PFMS-${Date.now().toString().slice(-6)}`,
        projectId: 'NHAI-TN-BCE-04',
        parcelIds: ['PARCEL-TN-KAN-104', 'PARCEL-TN-KAN-106'],
        authorizedOfficer: currentUser.name,
        otpSignature: 'CALA-GOV-TOKEN-7729'
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
      fetchData();
    } catch (err) {
      console.error('Error executing PFMS disbursement:', err);
    } finally {
      setDisbursing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CALA Compensation & PFMS Disbursement Ledger
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Competent Authority (CALA) escrow monitoring, award passing & Direct Benefit Transfer (DBT) reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded flex items-center gap-1 border border-emerald-300">
              <Check className="w-3.5 h-3.5" /> Transmitted to PFMS Gateway!
            </span>
          )}
          <button
            onClick={handleDisburseBatch}
            disabled={disbursing}
            className="px-3.5 py-2 bg-emerald-700 text-white hover:bg-emerald-800 rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            {disbursing ? 'Transmitting to PFMS...' : 'Execute Batch PFMS Transfer'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Awarded under Sec 3G"
            value={`₹${overview.totalCompensationAwardedCr}`}
            unit="Cr"
            icon={CreditCard}
            subtitle="100% of published awards"
            variant="default"
          />
          <StatCard
            title="Total Disbursed (PFMS)"
            value={`₹${overview.totalDisbursedCr}`}
            unit="Cr"
            icon={CheckCircle2}
            subtitle={`${overview.disbursementRatePct}% disbursement rate`}
            variant="success"
          />
          <StatCard
            title="Pending Disbursement"
            value={`₹${overview.totalPendingCr}`}
            unit="Cr"
            icon={AlertCircle}
            subtitle="Undisbursed awards across khatas"
            variant="danger"
          />
          <StatCard
            title="CALA Escrow Account Balance"
            value={`₹${overview.calaAccountBalanceCr}`}
            unit="Cr"
            icon={Building}
            subtitle="Funds parked in designated treasury"
            variant="warning"
          />
        </div>
      )}

      {/* District-wise Compensation Breakdown */}
      {overview?.districtPerformance && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            District-wise Compensation Awarded vs Disbursed (₹ Crores)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Comparison of total statutory award amount against actual treasury disbursals to landowners
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overview.districtPerformance}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Bar dataKey="awarded" fill="#94a3b8" name="Awarded (₹ Cr)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disbursed" fill="#1e3a8a" name="Disbursed (₹ Cr)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#dc2626" name="Pending (₹ Cr)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Landowner Khata Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Khata-wise Beneficiary Landowner Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Micro-level land parcel records with Aadhaar authentication & bank payment status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 py-3">Case ID</th>
                <th className="px-3 py-3">Khata / Survey</th>
                <th className="px-3 py-3">Village & District</th>
                <th className="px-3 py-3">Landowner Name</th>
                <th className="px-3 py-3">Area (Ha)</th>
                <th className="px-3 py-3 font-mono">Awarded (₹)</th>
                <th className="px-3 py-3 font-mono">Disbursed (₹)</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3">Delay Reason / PFMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono text-slate-600 font-bold">{c.caseId}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-blue-950">
                    {c.khataNo} / {c.surveyNo}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-slate-900">{c.village}</div>
                    <div className="text-[10px] text-slate-500">{c.district}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-slate-900">{c.landownerName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{c.aadhaarMasked}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono">{c.areaHa}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-900 font-semibold">
                    ₹{(c.awardedAmountINR / 100000).toFixed(1)} L
                  </td>
                  <td className="px-3 py-2.5 font-mono text-emerald-800 font-bold">
                    ₹{(c.disbursedAmountINR / 100000).toFixed(1)} L
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'DISBURSED_SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : (c.status === 'DISPUTED_ESCROW' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 max-w-xs truncate" title={c.delayReason}>
                    {c.delayReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
