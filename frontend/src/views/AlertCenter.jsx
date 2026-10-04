import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAlerts, acknowledgeAlert, resolveAlert, dispatchAlertNotification } from '../services/api';
import RiskBadge from '../components/common/RiskBadge';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Filter,
  UserCheck,
  Send,
  ExternalLink,
  Check,
  X,
  BellRing,
  Smartphone,
  Mail
} from 'lucide-react';

export default function AlertCenter({ onSelectProject }) {
  const { currentUser, t } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Action Modal State
  const [activeAlert, setActiveAlert] = useState(null);
  const [actionType, setActionType] = useState('ACKNOWLEDGE'); // 'ACKNOWLEDGE' | 'RESOLVE'
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState({});

  const handleDispatchNotification = async (alertId) => {
    setDispatchingId(alertId);
    try {
      const res = await dispatchAlertNotification(alertId, currentUser.name);
      setBroadcastSuccess(prev => ({ ...prev, [alertId]: res }));
      setTimeout(() => {
        setBroadcastSuccess(prev => ({ ...prev, [alertId]: null }));
      }, 5000);
      fetchAlerts();
    } catch (err) {
      console.error('Error dispatching notifications:', err);
    } finally {
      setDispatchingId(null);
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await getAlerts({
        priority: priorityFilter,
        status: statusFilter
      });
      setAlerts(data.items || []);
    } catch (err) {
      console.error('Error loading alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [priorityFilter, statusFilter]);

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!activeAlert) return;

    setSubmitting(true);
    try {
      if (actionType === 'ACKNOWLEDGE') {
        await acknowledgeAlert(activeAlert.id, currentUser.name, actionNotes || 'Acknowledged by authorized officer.');
      } else {
        await resolveAlert(activeAlert.id, currentUser.name, actionNotes || 'Resolved after statutory administrative intervention.');
      }
      setActiveAlert(null);
      setActionNotes('');
      fetchAlerts();
    } catch (err) {
      console.error('Error performing alert action:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Early Warning Alert Center
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Automated statutory threshold triggers, disbursement bottlenecks & litigation escalations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded border border-red-200 font-mono">
            {alerts.filter(a => a.priority === 'CRITICAL').length} Critical Escalations
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 font-medium text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Lifecycle Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 font-medium text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New Alerts</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 font-medium">
          Showing {alerts.length} early warning triggers
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const isCritical = alert.priority === 'CRITICAL';
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-5 shadow-xs space-y-3 transition-all ${
                isCritical ? 'border-red-200 bg-red-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <RiskBadge level={alert.priority} showScore={false} size="md" />
                  <span className="text-xs font-mono font-bold text-slate-500">{alert.id}</span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {alert.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-mono">Detected: {alert.detectedDate}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : (alert.status === 'NEW' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-blue-100 text-blue-800')
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-950 font-medium">
                <span className="font-bold block text-[10px] uppercase text-blue-900 mb-0.5">Recommended Statutory Intervention</span>
                {alert.recommendedAction}
              </div>

              {/* Multi-Channel Notification Dispatch Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 text-[11px] uppercase flex items-center gap-1">
                    <BellRing className="w-3.5 h-3.5 text-blue-900" />
                    <span>Automated Multi-Channel Notification Status:</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                      <Smartphone className="w-2.5 h-2.5" /> NIC SMS Gateway: DELIVERED
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">
                      <Mail className="w-2.5 h-2.5" /> Email API: DISPATCHED
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono text-[10px] font-bold">
                      <Send className="w-2.5 h-2.5" /> Push Notification: ACTIVE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {broadcastSuccess[alert.id] ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Transmitted via CDAC / NIC Gateway!
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDispatchNotification(alert.id)}
                      disabled={dispatchingId === alert.id}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3 h-3 text-slate-600" />
                      <span>{dispatchingId === alert.id ? 'Transmitting to Gateways...' : 'Broadcast to SMS / Email Gateways'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Project:</span>
                  <button
                    onClick={() => onSelectProject(alert.projectId)}
                    className="font-bold text-blue-900 hover:underline flex items-center gap-1"
                  >
                    <span>{alert.projectName} ({alert.projectId})</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status !== 'RESOLVED' && (
                    <>
                      {alert.status === 'NEW' && (
                        <button
                          onClick={() => {
                            setActiveAlert(alert);
                            setActionType('ACKNOWLEDGE');
                            setActionNotes('');
                          }}
                          className="px-3 py-1.5 rounded bg-blue-900 text-white font-semibold hover:bg-blue-950 text-xs shadow-xs"
                        >
                          Acknowledge & Assign
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveAlert(alert);
                          setActionType('RESOLVE');
                          setActionNotes('');
                        }}
                        className="px-3 py-1.5 rounded bg-emerald-700 text-white font-semibold hover:bg-emerald-800 text-xs shadow-xs"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Recording Modal */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {actionType === 'ACKNOWLEDGE' ? 'Acknowledge Statutory Alert' : 'Mark Alert Resolved'}
              </h3>
              <button onClick={() => setActiveAlert(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="space-y-3">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Target Alert:</span>
                <p className="text-slate-900 font-bold bg-slate-50 p-2 rounded border border-slate-200">
                  {activeAlert.title}
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {actionType === 'ACKNOWLEDGE' ? 'Assigned Officer / SLAO' : 'Resolution Action Summary *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={
                    actionType === 'ACKNOWLEDGE'
                      ? 'Enter assignment instructions or designated Special Land Acquisition Officer...'
                      : 'Summarize statutory action taken (e.g. Special Lok Adalat completed, interim stay vacated, funds released via PFMS)...'
                  }
                  className="w-full border border-slate-300 rounded p-2 focus:outline-blue-900"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAlert(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-blue-900 text-white rounded font-semibold hover:bg-blue-950 flex items-center gap-1"
                >
                  {submitting ? 'Submitting...' : (actionType === 'ACKNOWLEDGE' ? 'Confirm Acknowledgment' : 'Confirm Resolution')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
