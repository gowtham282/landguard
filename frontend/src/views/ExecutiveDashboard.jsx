import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProjectsSummary,
  getProjectsList,
  getAlerts,
  getAnalyticsBenchmarks
} from '../services/api';
import StatCard from '../components/common/StatCard';
import RiskBadge from '../components/common/RiskBadge';
import {
  FolderGit2,
  AlertOctagon,
  AlertTriangle,
  LandPlot,
  CreditCard,
  Scale,
  Users,
  Clock,
  Filter,
  RefreshCw,
  ArrowUpRight,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export default function ExecutiveDashboard({ onNavigate, onSelectProject }) {
  const { t } = useAuth();

  // Filters State
  const [stateFilter, setStateFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  // Data States
  const [summary, setSummary] = useState(null);
  const [highRiskProjects, setHighRiskProjects] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [benchmarks, setBenchmarks] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const summaryData = await getProjectsSummary({
        state: stateFilter,
        district: districtFilter,
        projectType: typeFilter,
        riskLevel: riskFilter,
      });
      setSummary(summaryData);

      const projectsData = await getProjectsList({
        state: stateFilter,
        district: districtFilter,
        projectType: typeFilter,
        riskLevel: riskFilter,
        stage: stageFilter,
        sortBy: 'riskScore',
        order: 'desc',
        limit: 6,
      });
      setHighRiskProjects(projectsData.items || []);

      const alertsData = await getAlerts();
      setRecentAlerts((alertsData.items || []).slice(0, 4));

      const benchData = await getAnalyticsBenchmarks();
      setBenchmarks(benchData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [stateFilter, districtFilter, typeFilter, riskFilter, stageFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Land Acquisition Risk Intelligence Dashboard
            </h1>
            <span className="bg-blue-100 text-blue-950 font-bold text-xs px-2.5 py-0.5 rounded font-mono border border-blue-200">
              SOUTHERN ZONE (TN &bull; KL &bull; PY &bull; AP &bull; KA)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Official early-detection and prescriptive delay mitigation portal for Competent Authorities (CALA / SLAO)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={loadDashboardData}
            className="p-2 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Refresh Intelligence Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => onNavigate('gis')}
            className="px-3 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS Map View</span>
          </button>
        </div>
      </div>

      {/* Multi-Tier Administrative Filter Ribbon (Exclusively 5 States) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          <Filter className="w-3.5 h-3.5 text-blue-900" />
          <span>Southern Region Administrative Filter Ribbon</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">State / UT</label>
            <select
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter('ALL'); }}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-blue-900"
            >
              <option value="ALL">All 5 Southern States</option>
              <option value="Tamil Nadu">Tamil Nadu (TN)</option>
              <option value="Kerala">Kerala (KL)</option>
              <option value="Puducherry">Puducherry (PY)</option>
              <option value="Andhra Pradesh">Andhra Pradesh (AP)</option>
              <option value="Karnataka">Karnataka (KA)</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">District</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-blue-900"
            >
              <option value="ALL">All Districts</option>
              {/* Tamil Nadu */}
              <optgroup label="Tamil Nadu">
                <option value="Kanchipuram">Kanchipuram</option>
                <option value="Chennai">Chennai</option>
                <option value="Tiruvallur">Tiruvallur</option>
                <option value="Salem">Salem</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
              </optgroup>
              {/* Kerala */}
              <optgroup label="Kerala">
                <option value="Malappuram">Malappuram</option>
                <option value="Alappuzha">Alappuzha</option>
                <option value="Kollam">Kollam</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Palakkad">Palakkad</option>
              </optgroup>
              {/* Puducherry */}
              <optgroup label="Puducherry">
                <option value="Puducherry">Puducherry</option>
              </optgroup>
              {/* Andhra Pradesh */}
              <optgroup label="Andhra Pradesh">
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Guntur">Guntur</option>
                <option value="Anantapur">Anantapur</option>
                <option value="Alluri Sitharama Raju">Alluri Sitharama Raju</option>
              </optgroup>
              {/* Karnataka */}
              <optgroup label="Karnataka">
                <option value="Bengaluru Urban">Bengaluru Urban</option>
                <option value="Bengaluru Rural">Bengaluru Rural</option>
                <option value="Kolar">Kolar</option>
                <option value="Ramanagara">Ramanagara</option>
                <option value="Belagavi">Belagavi</option>
                <option value="Chitradurga">Chitradurga</option>
              </optgroup>
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Infrastructure Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-blue-900"
            >
              <option value="ALL">All Infrastructure Types</option>
              <option value="EXPRESSWAY">Expressway (NE / Greenfield)</option>
              <option value="NATIONAL_HIGHWAY">National Highway (NHAI/MoRTH)</option>
              <option value="METRO_RAIL">Metro Rail (CMRL/KMRL/BMRCL)</option>
              <option value="RAILWAYS_DFC">Railways (Southern Railway/K-Rail)</option>
              <option value="PORT_CONNECTIVITY">Port Road Connectivity</option>
              <option value="IRRIGATION_CANAL">Irrigation Canal Network</option>
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Risk Severity</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-blue-900"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (&ge; 80%)</option>
              <option value="HIGH">High Risk (60% - 79%)</option>
              <option value="MEDIUM">Medium Risk (40% - 59%)</option>
              <option value="LOW">Low Risk (&lt; 40%)</option>
            </select>
          </div>

          {/* Acquisition Stage */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Statutory Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-blue-900"
            >
              <option value="ALL">All Statutory Stages</option>
              <option value="3A">Section 3A (Intention)</option>
              <option value="3C">Section 3C (Objections)</option>
              <option value="3D">Section 3D (Declaration)</option>
              <option value="3G">Section 3G (Award Determination)</option>
              <option value="3E">Section 3E (Possession)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 10 Executive KPI Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <StatCard
            title={t('totalProjects')}
            value={summary.totalProjects}
            icon={FolderGit2}
            subtitle={`${summary.activeProjects} active southern corridors`}
            variant="default"
            onClick={() => onNavigate('projects')}
          />
          <StatCard
            title={t('criticalRisk')}
            value={summary.criticalRiskProjects}
            icon={AlertOctagon}
            subtitle="Immediate intervention required"
            variant="danger"
            onClick={() => { setRiskFilter('CRITICAL'); }}
          />
          <StatCard
            title={t('highRisk')}
            value={summary.highRiskProjects}
            icon={AlertTriangle}
            subtitle="Likely delay within 90 days"
            variant="warning"
            onClick={() => { setRiskFilter('HIGH'); }}
          />
          <StatCard
            title="Projects At Risk"
            value={summary.atRiskProjectsTotal}
            icon={TrendingUp}
            subtitle={`${Math.round((summary.atRiskProjectsTotal / Math.max(summary.totalProjects, 1)) * 100)}% of monitored projects`}
            variant="warning"
          />
          <StatCard
            title={t('landRequired')}
            value={summary.totalLandRequiredHa}
            unit="Ha"
            icon={LandPlot}
            subtitle="Total statutory notification area"
            variant="default"
          />
          <StatCard
            title={t('landPossession')}
            value={summary.landPossessionHa}
            unit="Ha"
            icon={FileCheck}
            subtitle={`${summary.landPossessionPct}% physical RoW possession`}
            variant="success"
          />
          <StatCard
            title="Compensation Awarded"
            value={`₹${summary.compensationAwardedCr}`}
            unit="Cr"
            icon={CreditCard}
            subtitle="Sec 3G / 23 Awards passed"
            variant="default"
            onClick={() => onNavigate('compensation')}
          />
          <StatCard
            title={t('compensationPending')}
            value={`₹${summary.compensationPendingCr}`}
            unit="Cr"
            icon={CreditCard}
            subtitle="Undisbursed CALA account funds"
            variant="danger"
            onClick={() => onNavigate('compensation')}
          />
          <StatCard
            title={t('courtCases')}
            value={summary.activeCourtCases}
            icon={Scale}
            subtitle="High Court stays & Sec 3G(5)"
            variant="danger"
            onClick={() => onNavigate('legal')}
          />
          <StatCard
            title="R&R Families Pending"
            value={summary.rrPendingFamilies}
            icon={Users}
            subtitle={`Out of ${summary.affectedFamilies} total families`}
            variant="warning"
            onClick={() => onNavigate('legal')}
          />
        </div>
      )}

      {/* Main Visuals Row: Risk Distribution Donut + Stage Bottlenecks Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Overall Risk Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Overall Risk Distribution
              </h3>
              <p className="text-[11px] text-slate-500">
                Classification across Southern States
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Total: {summary?.totalProjects || 0}</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {summary?.riskDistribution && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.riskDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {summary.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* B. Stage-wise Risk Vulnerability */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Statutory Stage Distribution & Bottlenecks
              </h3>
              <p className="text-[11px] text-slate-500">
                Active projects at statutory milestones in TN, KL, PY, AP, KA
              </p>
            </div>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
              Sec 3G / Award Passing is Primary Bottleneck
            </span>
          </div>

          <div className="h-56 w-full">
            {summary?.stageDistribution && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summary.stageDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 10, fill: '#475569' }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Projects Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Priority Action Table: High & Critical Risk Corridors */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Priority Early-Warning Action Table (Southern Zone)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Projects with delay probability &ge; 60% requiring statutory intervention by District Collector / CALA
            </p>
          </div>

          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 36 Corridors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Project ID / Corridor</th>
                <th className="px-3 py-3">State & District</th>
                <th className="px-3 py-3">Statutory Stage</th>
                <th className="px-3 py-3 text-center">Risk Level</th>
                <th className="px-3 py-3 text-center">Delay Prob</th>
                <th className="px-3 py-3 text-center">Expected Delay</th>
                <th className="px-4 py-3">Top Bottleneck Risk Factor</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {highRiskProjects.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => onSelectProject(p.id)}
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-blue-950 text-xs truncate max-w-xs md:max-w-sm">
                      {p.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {p.id} &bull; {p.statutoryAct}
                    </div>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{p.district}</div>
                    <div className="text-[10px] text-slate-500">{p.state}</div>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
                      {p.currentStage.replace(/_/g, ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {p.daysAtCurrentStage} days at stage
                    </div>
                  </td>

                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <RiskBadge level={p.riskLevel} score={p.riskScore} showScore={false} size="sm" />
                  </td>

                  <td className="px-3 py-3 text-center font-mono font-bold text-xs whitespace-nowrap">
                    <span className={p.delayProbability >= 80 ? 'text-red-700 font-black' : 'text-orange-700'}>
                      {p.delayProbability}%
                    </span>
                  </td>

                  <td className="px-3 py-3 text-center font-mono text-xs whitespace-nowrap">
                    <span className="font-bold text-slate-900">+{p.predictedDelayDays}</span>
                    <span className="text-[10px] text-slate-500 ml-1">Days</span>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600 max-w-xs md:max-w-sm">
                    <div className="line-clamp-2" title={p.topRiskFactor}>
                      {p.topRiskFactor}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(p.id);
                      }}
                      className="px-2.5 py-1 rounded bg-blue-900 hover:bg-blue-950 text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs"
                    >
                      <span>Profile & SHAP</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Row: Alerts Feed + 12-Month Delay Backlog Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Alerts Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Southern Regional Alerts
              </h3>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              Alert Center
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onNavigate('alerts')}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {alert.title}
                  </span>
                  <RiskBadge level={alert.priority} showScore={false} size="sm" />
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                  {alert.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{alert.projectName}</span>
                  <span className="font-semibold text-blue-900">{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 12-Month Delay Trendline */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Southern Zone Delay Backlog Trajectory
              </h3>
              <p className="text-[11px] text-slate-500">
                12-Month historical trend and forecast for TN, KL, PY, AP, KA
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              -46% Projected Backlog Reduction
            </span>
          </div>

          <div className="h-64 w-full">
            {benchmarks?.monthlyTrend && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={benchmarks.monthlyTrend}
                  margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Line
                    type="monotone"
                    dataKey="avgDelayDays"
                    stroke="#1e3a8a"
                    strokeWidth={2.5}
                    name="Avg Delay Days"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="criticalProjects"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Critical Projects Count"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
