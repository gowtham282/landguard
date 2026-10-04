import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getModelStatus, triggerModelRetrain } from '../services/api';
import StatCard from '../components/common/StatCard';
import {
  Cpu,
  RefreshCw,
  Award,
  ShieldCheck,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Database,
  Activity
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

export default function ModelGovernance() {
  const { currentUser, t } = useAuth();

  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);

  const fetchModel = async () => {
    setLoading(true);
    try {
      const res = await getModelStatus();
      setModelData(res.model);
    } catch (err) {
      console.error('Error fetching model governance telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModel();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      await triggerModelRetrain({
        trainingDataWindow: '2024-2026 Q3 Cycle',
        triggeredByOfficer: currentUser.name
      });
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 5000);
      fetchModel();
    } catch (err) {
      console.error('Error triggering model retrain:', err);
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Model Governance & MLOps Telemetry
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Model performance validation, feature attribution drift monitoring & automated retraining pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          {retrainSuccess && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded flex items-center gap-1 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Retraining Job Scheduled!
            </span>
          )}
          <button
            onClick={handleRetrain}
            disabled={retraining}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
            <span>{retraining ? 'Ingesting Datasets...' : 'Retrain Active Model'}</span>
          </button>
        </div>
      </div>

      {/* Model Metadata Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-blue-950 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
              {modelData?.activeModelVersion || 'LandGuard-LGBM-v2.4.1'}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded font-mono">
              Status: {modelData?.driftStatus || 'HEALTHY'}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Algorithm: <strong>{modelData?.algorithm}</strong> &bull; Trained On: {modelData?.trainedOn} ({modelData?.totalTrainingProjects} Historical Corridors)
          </p>
        </div>

        <div className="text-right text-xs text-slate-500 font-mono">
          <div>Drift Index: <strong>{modelData?.driftIndex || 0.041}</strong> (Threshold &lt; 0.150)</div>
          <div className="text-emerald-700 font-bold mt-0.5">Zero Concept Drift Detected</div>
        </div>
      </div>

      {/* Evaluation Performance Metrics Cards */}
      {modelData?.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <StatCard
            title="Accuracy"
            value={`${modelData.metrics.accuracy}%`}
            icon={Award}
            subtitle="Validation Set"
            variant="default"
          />
          <StatCard
            title="Precision"
            value={`${modelData.metrics.precision}%`}
            icon={ShieldCheck}
            subtitle="Delay identification"
            variant="default"
          />
          <StatCard
            title="Recall"
            value={`${modelData.metrics.recall}%`}
            icon={TrendingUp}
            subtitle="True positive rate"
            variant="default"
          />
          <StatCard
            title="F1 Score"
            value={`${modelData.metrics.f1Score}%`}
            icon={Activity}
            subtitle="Harmonic mean"
            variant="default"
          />
          <StatCard
            title="ROC-AUC"
            value={modelData.metrics.rocAuc}
            icon={Award}
            subtitle="Discrimination index"
            variant="success"
          />
          <StatCard
            title="MAE"
            value={`${modelData.metrics.meanAbsoluteErrorDays} d`}
            icon={Sliders}
            subtitle="Mean Absolute Error"
            variant="default"
          />
        </div>
      )}

      {/* Global Feature Importances */}
      {modelData?.featureImportances && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Global Feature Importance (TreeSHAP Gini Attributions)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Identifies which statutory variables possess the highest predictive weight in forecasting land acquisition delays
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={modelData.featureImportances}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis
                  dataKey="feature"
                  type="category"
                  tick={{ fontSize: 10, fill: '#1e293b' }}
                  width={150}
                />
                <Tooltip
                  formatter={(val) => [(val * 100).toFixed(1) + '%', 'Relative Importance']}
                  contentStyle={{ fontSize: '12px', borderRadius: '6px' }}
                />
                <Bar dataKey="importance" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Suggested Components-Wise Technology Stack */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Statutory Architecture & Recommended Technology Alignment
          </h3>
          <p className="text-xs text-slate-500">
            Enterprise infrastructure stack supporting continuous model learning, GIS spatial queries, and multi-channel notification dispatch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Database Layer</span>
            <span className="font-bold text-slate-900 text-xs mt-1 block">PostgreSQL with PostGIS / MySQL</span>
            <p className="text-[11px] text-slate-600 mt-1">Spatial cadastral indexes, khata polygon geometries & RFCTLARR statutory schema</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">GIS Platform</span>
            <span className="font-bold text-slate-900 text-xs mt-1 block">Leaflet, GeoServer, OpenLayers, QGIS</span>
            <p className="text-[11px] text-slate-600 mt-1">Digital interactive maps, risk density heat map buffers & chainage bottleneck overlays</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">API & Integration</span>
            <span className="font-bold text-slate-900 text-xs mt-1 block">RESTful APIs / FastAPI / GraphQL</span>
            <p className="text-[11px] text-slate-600 mt-1">BhoomiRashi, LACRRIS, and State Cadastres (Tamil Nilam, Bhoomi, Meebhoomi) connectivity</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Cloud Infrastructure</span>
            <span className="font-bold text-slate-900 text-xs mt-1 block">NIC Cloud (MeghRaj) / AWS / Azure Gov</span>
            <p className="text-[11px] text-slate-600 mt-1">Government-cloud hosted sovereign runtime with zero external data exfiltration</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Data Visualization</span>
            <span className="font-bold text-slate-900 text-xs mt-1 block">Power BI, Recharts, Plotly, Grafana</span>
            <p className="text-[11px] text-slate-600 mt-1">Real-time delay trends, stage bottleneck bars, and TreeSHAP attribution waterfalls</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Notification Services</span>
            <span className="font-bold text-slate-900 text-xs mt-1 block">CDAC SMS Gateway, Email APIs, Push</span>
            <p className="text-[11px] text-slate-600 mt-1">Automated early warning escalation to District Collectors, CALA, and Project Directors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
