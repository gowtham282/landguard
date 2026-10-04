import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProjectsList, createProject } from '../services/api';
import RiskBadge from '../components/common/RiskBadge';
import {
  Search,
  Filter,
  Plus,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LandPlot,
  Calendar,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';

export default function ProjectsDirectory({ onSelectProject }) {
  const { t } = useAuth();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('riskScore');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Data
  const [projectsData, setProjectsData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // New Project Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    projectType: 'EXPRESSWAY',
    statutoryAct: 'NH_ACT_1956',
    implementingAgency: 'National Highways Authority of India',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    totalLengthKm: 45.0,
    totalLandRequiredHa: 180.0,
    totalProjectCostCr: 3500.0,
    estimatedLandCostCr: 950.0,
    targetCompletionDate: '2026-12-31'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjectsList({
        search: searchTerm,
        state: stateFilter,
        projectType: typeFilter,
        riskLevel: riskFilter,
        stage: stageFilter,
        sortBy,
        order,
        page,
        limit: 10
      });
      setProjectsData(data);
    } catch (err) {
      console.error('Error listing projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, stateFilter, typeFilter, riskFilter, stageFilter, sortBy, order, page]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('desc');
    }
  };

  const handleExportCSV = () => {
    if (!projectsData.items.length) return;
    const headers = ['Project ID', 'Name', 'State', 'District', 'Type', 'Land Required (Ha)', 'Land Acquired (Ha)', 'Risk Level', 'Risk Score', 'Delay Probability', 'Expected Delay (Days)', 'Current Stage'];
    const rows = projectsData.items.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.state,
      p.district,
      p.projectType,
      p.totalLandRequiredHa,
      p.landAcquiredHa,
      p.riskLevel,
      p.riskScore,
      `${p.delayProbability}%`,
      p.predictedDelayDays,
      p.currentStage
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LandGuard_Projects_Register_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await createProject(newProjectForm);
      setShowAddModal(false);
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Projects Management & Registry
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            BhoomiRashi & LACRRIS integrated registry of national & state land acquisition corridors
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-md bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Project</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search projects by name, gazette notification number, corridor code, or district..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-blue-900 focus:bg-white bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
            <select
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">All 5 Southern States</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Type</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800"
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

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Risk Severity</label>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (&ge; 80%)</option>
              <option value="HIGH">High Risk (60% - 79%)</option>
              <option value="MEDIUM">Medium Risk (40% - 59%)</option>
              <option value="LOW">Low Risk (&lt; 40%)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Statutory Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">All Stages</option>
              <option value="3A">Section 3A (Intention)</option>
              <option value="3C">Section 3C (Objections)</option>
              <option value="3D">Section 3D (Declaration)</option>
              <option value="3G">Section 3G (Award)</option>
              <option value="3E">Section 3E (Possession)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Administrative Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Project Name & ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">State / District</th>
                <th className="px-3 py-3 cursor-pointer select-none" onClick={() => handleSort('totalLandRequiredHa')}>
                  <div className="flex items-center gap-1">
                    <span>Land Progress (Ha)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">Statutory Stage</th>
                <th className="px-3 py-3 text-center cursor-pointer select-none" onClick={() => handleSort('riskScore')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 text-center cursor-pointer select-none" onClick={() => handleSort('delayProbability')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Delay Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 text-center cursor-pointer select-none" onClick={() => handleSort('predictedDelayDays')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Delay Est.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {projectsData.items.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-blue-950 text-xs truncate max-w-xs md:max-w-sm" title={p.name}>
                      {p.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold">{p.id}</span>
                      <span>&bull;</span>
                      <span>{p.gazetteId}</span>
                      <span>&bull;</span>
                      <span className="bg-slate-100 px-1.5 rounded">{p.statutoryAct}</span>
                    </div>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{p.district}</div>
                    <div className="text-[10px] text-slate-500">{p.state}</div>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-800">{p.landAcquiredHa} Ha</span>
                      <span className="text-[10px] text-slate-400">of {p.totalLandRequiredHa} Ha</span>
                    </div>
                    <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-900 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.round((p.landAcquiredHa / Math.max(p.totalLandRequiredHa, 1)) * 100))}%` }}
                      ></div>
                    </div>
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

                  <td className="px-3 py-3 text-center font-mono text-xs whitespace-nowrap font-bold">
                    <span className={p.delayProbability >= 80 ? 'text-red-700 font-black' : (p.delayProbability >= 60 ? 'text-orange-700' : 'text-slate-700')}>
                      {p.delayProbability}%
                    </span>
                  </td>

                  <td className="px-3 py-3 text-center font-mono text-xs whitespace-nowrap">
                    <span className="font-bold text-slate-900">+{p.predictedDelayDays}</span>
                    <span className="text-[10px] text-slate-500 ml-1">Days</span>
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(p.id);
                      }}
                      className="px-2.5 py-1 rounded bg-blue-900 hover:bg-blue-950 text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/70">
          <div>
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, projectsData.total)} of {projectsData.total} monitored projects
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-300 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold">
              Page {page} of {projectsData.totalPages || 1}
            </span>
            <button
              disabled={page >= projectsData.totalPages}
              onClick={() => setPage(p => Math.min(projectsData.totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-300 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Register New Statutory Project */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-blue-950">
                  Register New Statutory Land Acquisition Corridor
                </h3>
                <p className="text-xs text-slate-500">
                  Initializes statutory tracking under Section 3A (NH Act) or Section 4(1) (RFCTLARR Act)
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project / Corridor Name *</label>
                <input
                  type="text"
                  required
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                  placeholder="e.g. Bengaluru-Chennai Expressway Package 5 (Sriperumbudur to Maduravoyal)"
                  className="w-full border border-slate-300 rounded p-2 focus:outline-blue-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Type *</label>
                  <select
                    value={newProjectForm.projectType}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectType: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="EXPRESSWAY">Expressway (National Highway)</option>
                    <option value="NATIONAL_HIGHWAY">National Highway</option>
                    <option value="METRO_RAIL">Metro Rail Project</option>
                    <option value="RAILWAYS_DFC">Dedicated Freight Corridor</option>
                    <option value="INDUSTRIAL_CORRIDOR">Industrial Corridor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Governing Statutory Act *</label>
                  <select
                    value={newProjectForm.statutoryAct}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, statutoryAct: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="NH_ACT_1956">National Highways Act, 1956</option>
                    <option value="RFCTLARR_2013">RFCTLARR Act, 2013</option>
                    <option value="RAILWAYS_ACT_1989">Railways Act, 1989</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <select
                    required
                    value={newProjectForm.state}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, state: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary District *</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.district}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, district: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Alignment Length (Km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProjectForm.totalLengthKm}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, totalLengthKm: parseFloat(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Land Required (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProjectForm.totalLandRequiredHa}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, totalLandRequiredHa: parseFloat(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Project Cost (₹ Crores) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProjectForm.totalProjectCostCr}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, totalProjectCostCr: parseFloat(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Land Acquisition Cost (₹ Cr) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProjectForm.estimatedLandCostCr}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, estimatedLandCostCr: parseFloat(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 font-semibold flex items-center gap-1.5"
                >
                  {formSubmitting ? 'Registering...' : 'Register Project & Publish 3A'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
