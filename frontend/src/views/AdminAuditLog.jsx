import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuditLogs } from '../services/api';
import {
  History,
  ShieldCheck,
  Filter,
  Search,
  Download,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function AdminAuditLog({ onSelectProject }) {
  const { t } = useAuth();

  const [logs, setLogs] = useState([]);
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await getAuditLogs({
          module: moduleFilter,
          role: roleFilter
        });
        setLogs(data.items || []);
      } catch (err) {
        console.error('Error loading audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [moduleFilter, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Traceable Government Audit Trail
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Immutable chronicle of administrative decisions, award sanctions, alert acknowledgments & system events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Cryptographically Chained</span>
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 font-medium text-xs"
            >
              <option value="ALL">All Administrative Modules</option>
              <option value="RECOMMENDATION_ENGINE">Recommendation Engine</option>
              <option value="COMPENSATION_LEDGER">Compensation Ledger</option>
              <option value="ALERT_CENTER">Alert Center</option>
              <option value="PROJECT_MANAGEMENT">Project Management</option>
              <option value="MODEL_GOVERNANCE">Model Governance</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Officer Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 font-medium text-xs"
            >
              <option value="ALL">All Roles</option>
              <option value="DISTRICT_COLLECTOR">District Collector</option>
              <option value="CALA_OFFICER">CALA / SLAO</option>
              <option value="PROJECT_DIRECTOR">Project Director</option>
              <option value="POLICY_ANALYST">Policy Analyst</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 font-medium">
          Showing {logs.length} immutable records
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-3 py-3">Official Name</th>
                <th className="px-3 py-3">Role Designation</th>
                <th className="px-3 py-3">Action Type</th>
                <th className="px-3 py-3">Module</th>
                <th className="px-3 py-3">Project / Context</th>
                <th className="px-4 py-3">Description of Action</th>
                <th className="px-3 py-3">Client IP</th>
                <th className="px-3 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 font-mono">
                  <td className="px-4 py-3 text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp?.replace('T', ' ').replace('Z', '')}
                  </td>
                  <td className="px-3 py-3 font-sans font-bold text-slate-900 whitespace-nowrap">
                    {log.officialName}
                  </td>
                  <td className="px-3 py-3 text-[11px] text-blue-900 font-bold whitespace-nowrap">
                    {log.role}
                  </td>
                  <td className="px-3 py-3 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-3 py-3 text-[11px] text-slate-500 whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="px-3 py-3 font-bold text-blue-950 whitespace-nowrap">
                    {log.projectId ? (
                      <button
                        onClick={() => log.projectId !== 'GLOBAL' && onSelectProject(log.projectId)}
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>{log.projectId}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-slate-700 max-w-sm">
                    {log.description}
                  </td>
                  <td className="px-3 py-3 text-[11px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.status}
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
