import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsBenchmarks } from '../services/api';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export default function AnalyticsReports() {
  const { t, currentUser } = useAuth();

  const [benchmarks, setBenchmarks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAnalyticsBenchmarks();
        setBenchmarks(data);
      } catch (err) {
        console.error('Error loading analytics benchmarks:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            National Land Acquisition Analytics & Reports
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Inter-state benchmarking league tables, stage cycle time diagnostics & Gazette-style review memos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Memo</span>
          </button>
          <button
            onClick={() => alert('Exporting Comprehensive National Land Acquisition Annual Review (Excel/PDF)...')}
            className="px-3.5 py-2 bg-blue-900 text-white hover:bg-blue-950 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Gazette Report</span>
          </button>
        </div>
      </div>

      {/* Printable Gazette Memo Header (Displays on Print) */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wide">Government of India</h2>
        <h3 className="text-sm font-semibold">Ministry of Road Transport and Highways &middot; Department of Land Resources</h3>
        <p className="text-xs mt-1">LandGuard AI &mdash; Monthly Land Acquisition Delay Diagnostic & Review Memo</p>
        <p className="text-[10px] text-slate-500 font-mono mt-1">Generated: {new Date().toLocaleString()} by {currentUser.name}</p>
      </div>

      {/* Statutory Stage Cycle Time Benchmarks */}
      {benchmarks?.stageCycleBenchmarks && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Statutory Stage Cycle Times: Statutory Benchmark vs National Actual (Days)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates processing cycle durations under RFCTLARR 2013 and Section 3A-3E benchmarks
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={benchmarks.stageCycleBenchmarks}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                <Bar dataKey="statutoryBenchmark" fill="#16a34a" name="Statutory Benchmark (Days)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nationalAverageActual" fill="#dc2626" name="National Actual Average (Days)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* State Performance Benchmarking League Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            State-wise Land Acquisition Risk & Disbursement League Table
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Benchmark Period: 2025-2026 Cycle
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">State Jurisdiction</th>
                <th className="px-3 py-3 text-center">Active Corridors</th>
                <th className="px-3 py-3 text-center">Critical Projects</th>
                <th className="px-3 py-3 text-center">Average Stage Delay</th>
                <th className="px-3 py-3 text-center">Compensation Disbursed</th>
                <th className="px-4 py-3 text-right">Performance Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {benchmarks?.stateMetrics?.map((s, idx) => (
                <tr key={s.state} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-blue-950 text-xs">
                    {s.state}
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-slate-800">
                    {s.activeProjects}
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-red-700">
                    {s.criticalProjects}
                  </td>
                  <td className="px-3 py-3 text-center font-mono">
                    +{s.avgDelayDays} Days
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-emerald-800">
                    {s.disbursementRate}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Rank #{idx + 1}
                    </span>
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
