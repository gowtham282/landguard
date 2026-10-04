import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProjectDetails,
  runWhatIfSimulation,
  disburseCompensationBatch,
  recordRecommendationDecision
} from '../services/api';
import RiskBadge from '../components/common/RiskBadge';
import Breadcrumbs from '../components/common/Breadcrumbs';
import {
  FolderGit2,
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  LandPlot,
  CreditCard,
  Scale,
  Users,
  FileText,
  Lightbulb,
  MapPin,
  History,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Sliders,
  Send,
  Building,
  Calendar,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';

export default function ProjectDetailProfile({ projectId, onNavigate, onGoBack }) {
  const { currentUser, t } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // What-If Simulator State
  const [compBoost, setCompBoost] = useState(30);
  const [courtResolved, setCourtResolved] = useState(2);
  const [stageExpedite, setStageExpedite] = useState(20);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Batch Disbursement Modal
  const [disbursing, setDisbursing] = useState(false);
  const [disburseSuccess, setDisburseSuccess] = useState(false);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const res = await getProjectDetails(projectId);
      setData(res);
      // Run initial simulation
      handleRunSimulation(30, 2, 20);
    } catch (err) {
      console.error('Error fetching project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleRunSimulation = async (comp = compBoost, court = courtResolved, expedite = stageExpedite) => {
    setSimulating(true);
    try {
      const res = await runWhatIfSimulation(projectId, {
        compensationBoostPct: comp,
        courtCasesResolved: court,
        expediteStageDays: expedite
      });
      setSimResult(res.simulation);
    } catch (err) {
      console.error('Error running what-if simulation:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleDisburseBatch = async () => {
    setDisbursing(true);
    try {
      await disburseCompensationBatch({
        batchId: `BATCH-${Date.now().toString().slice(-6)}`,
        projectId,
        parcelIds: ['PARCEL-TN-KAN-104', 'PARCEL-TN-KAN-106'],
        authorizedOfficer: currentUser.name,
        otpSignature: 'OTP-VERIFIED-9921'
      });
      setDisburseSuccess(true);
      setTimeout(() => setDisburseSuccess(false), 4000);
    } catch (err) {
      console.error('Error executing batch disbursement:', err);
    } finally {
      setDisbursing(false);
    }
  };

  const handleAcceptRecommendation = async (recId) => {
    try {
      await recordRecommendationDecision(recId, {
        decision: 'APPROVE',
        officialName: currentUser.name,
        officialRole: currentUser.role,
        remarks: 'Approved intervention for immediate administrative execution.'
      });
      fetchProjectData();
    } catch (err) {
      console.error('Error deciding recommendation:', err);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        <div className="animate-spin w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full mx-auto mb-3"></div>
        <span>Loading statutory project profile & SHAP intelligence...</span>
      </div>
    );
  }

  const { project, stages, parcels, legalCases, rrCases, documents, shapExplanation } = data;

  const tabs = [
    { id: 'overview', label: '1. Overview', icon: FolderGit2 },
    { id: 'progress', label: '2. Progress & RoW', icon: LandPlot },
    { id: 'risk', label: '3. Risk Prediction', icon: AlertOctagon },
    { id: 'timeline', label: '4. Stage Timeline', icon: Clock },
    { id: 'shap', label: '5. Explainable AI (SHAP)', icon: Sparkles },
    { id: 'gis', label: '6. GIS Alignment', icon: MapPin },
    { id: 'compensation', label: '7. Compensation', icon: CreditCard },
    { id: 'legal', label: '8. Legal / R&R', icon: Scale },
    { id: 'documents', label: '9. Documents', icon: FileText },
    { id: 'alerts', label: '10. Alerts', icon: AlertTriangle },
    { id: 'recommendations', label: '11. Recommendations', icon: Lightbulb },
    { id: 'audit', label: '12. Audit Log', icon: History },
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Projects Directory', view: 'projects' },
          { label: project.name, view: 'project_detail' }
        ]}
        onNavigate={onNavigate}
        onGoBack={onGoBack}
      />

      {/* Official Project Intelligence Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold bg-blue-100 text-blue-950 px-2.5 py-0.5 rounded border border-blue-200">
                {project.id}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Gazette: {project.gazetteId}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                {project.statutoryAct}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                {project.projectType}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {project.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
              <span><strong>Implementing Agency:</strong> {project.implementingAgency}</span>
              <span>&bull;</span>
              <span><strong>Jurisdiction:</strong> {project.district}, {project.state}</span>
              <span>&bull;</span>
              <span><strong>Affected Villages:</strong> {project.affectedVillages}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-6 shrink-0">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Overall Delay Risk</div>
              <div className="mt-1 flex items-center gap-2">
                <RiskBadge level={project.riskLevel} score={project.delayProbability} size="md" />
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Expected Delay</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900">
                +{project.predictedDelayDays} <span className="text-xs font-normal text-slate-500">Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Dedicated Operational Tabs Ribbon */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENTS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Statutory Project Charter & Description
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                The {project.name} is a high-priority national connectivity corridor spanning {project.totalLengthKm} km across {project.affectedVillages} revenue villages in {project.district} district. Statutory land acquisition is being executed under {project.statutoryAct} by the {project.implementingAgency} with the Competent Authority (CALA / DRO) overseeing award determinations and direct benefit transfers via PFMS.
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sanction Date</span>
                  <span className="font-mono font-bold text-slate-900">{project.sanctionDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Date</span>
                  <span className="font-mono font-bold text-slate-900">{project.targetCompletionDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Forecast Date</span>
                  <span className="font-mono font-bold text-red-700">{project.forecastCompletionDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Stays</span>
                  <span className="font-mono font-bold text-amber-800">{project.activeCourtCases} Cases</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Financial Liquidity & CALA Treasury Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Project Cost</span>
                  <span className="font-mono font-bold text-base text-slate-900">₹{project.totalProjectCostCr} Cr</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Land Budget</span>
                  <span className="font-mono font-bold text-base text-slate-900">₹{project.estimatedLandCostCr} Cr</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Awarded under 3G</span>
                  <span className="font-mono font-bold text-base text-blue-900">₹{project.compensationAwardedCr} Cr</span>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <span className="text-red-700 text-[10px] uppercase font-bold block">CALA Unpaid Balance</span>
                  <span className="font-mono font-bold text-base text-red-800">₹{project.calaAccountBalanceCr} Cr</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Current Bottleneck Risk
              </h3>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-950 font-medium leading-relaxed">
                {project.topRiskFactor}
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Current Milestone:</span>
                  <span className="font-mono font-bold text-slate-900">{project.currentStage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days in Current Stage:</span>
                  <span className="font-mono font-bold text-red-700">{project.daysAtCurrentStage} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Prediction Confidence:</span>
                  <span className="font-mono font-bold text-emerald-700">{project.predictionConfidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACQUISITION PROGRESS & ROW */}
      {activeTab === 'progress' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Right-of-Way (RoW) Milestone Progression
            </h3>
            <p className="text-xs text-slate-500">
              Statutory progression from Notification 3A to final physical possession
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Total Required</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{project.totalLandRequiredHa} Ha</span>
              <span className="text-xs text-slate-500 mt-1 block">100% of corridor footprint</span>
            </div>
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">2. Declared (Sec 3D)</span>
              <span className="text-xl font-bold font-mono text-blue-950 mt-1 block">{project.totalLandRequiredHa} Ha</span>
              <span className="text-xs text-blue-700 mt-1 block">100% declaration complete</span>
            </div>
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">3. Award Passed (3G)</span>
              <span className="text-xl font-bold font-mono text-amber-950 mt-1 block">{project.landAcquiredHa} Ha</span>
              <span className="text-xs text-amber-700 mt-1 block">{project.progressPercentage}% awarded</span>
            </div>
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">4. Possession Taken (3E)</span>
              <span className="text-xl font-bold font-mono text-emerald-950 mt-1 block">{project.landPossessionHa} Ha</span>
              <span className="text-xs text-emerald-700 mt-1 block">
                {Math.round((project.landPossessionHa / project.totalLandRequiredHa) * 100)}% handed to contractor
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI RISK PREDICTION */}
      {activeTab === 'risk' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Machine Learning Delay Risk Diagnostic
              </h3>
              <p className="text-xs text-slate-500">
                Gradient Boosting Regressor (LightGBM) trained on 1,420 historical infrastructure projects
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-1 rounded">
              Confidence: {project.predictionConfidence}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-red-200 bg-red-50/60 text-center">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider block">Delay Probability</span>
              <span className="text-4xl font-black font-mono text-red-700 my-2 block">
                {project.delayProbability}%
              </span>
              <RiskBadge level={project.riskLevel} showScore={false} size="md" />
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Expected Delay Duration</span>
              <span className="text-4xl font-black font-mono text-slate-900 my-2 block">
                +{project.predictedDelayDays} <span className="text-base font-normal text-slate-500">Days</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Beyond target completion date</span>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Target vs Forecast Date</span>
              <div className="my-2">
                <span className="text-xs text-slate-500 line-through block">{project.targetCompletionDate}</span>
                <span className="text-lg font-bold font-mono text-red-700 block">{project.forecastCompletionDate}</span>
              </div>
              <span className="text-xs text-red-600 font-medium">Lapse imminent without intervention</span>
            </div>
          </div>

          {/* Stage-Wise Delay Probability Progression */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Stage-Wise Delay Probability Progression (RFCTLARR 2013 & NH Act 1956)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Calibrated predictive risk across each statutory milestone of the land acquisition lifecycle
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                Multi-Stage Forecasting
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {[
                { code: '3A', name: 'Section 3A (Intention)', prob: project.stageDelayProbabilities?.STAGE_1_NOTIFICATION_3A ?? 18.0, desc: 'Preliminary notification' },
                { code: '3C', name: 'Section 3C (Objections)', prob: project.stageDelayProbabilities?.STAGE_2_JMS_AND_OBJECTIONS_3C ?? 42.0, desc: 'Landowner objections & JMS' },
                { code: '3D', name: 'Section 3D (Declaration)', prob: project.stageDelayProbabilities?.STAGE_3_DECLARATION_3D ?? 64.0, desc: 'Statutory declaration of acquisition' },
                { code: '3G', name: 'Section 3G (Award)', prob: project.stageDelayProbabilities?.STAGE_4_COMPENSATION_AWARD_3G ?? project.delayProbability, desc: 'Valuation & award determination' },
                { code: '3E', name: 'Section 3E (Possession)', prob: project.stageDelayProbabilities?.STAGE_5_POSSESSION_3E ?? 72.0, desc: 'Physical eviction & RoW clearance' },
              ].map((st, sIdx) => {
                const isCrit = st.prob >= 80;
                const isHigh = st.prob >= 60 && st.prob < 80;
                const isMed = st.prob >= 40 && st.prob < 60;
                return (
                  <div key={sIdx} className={`p-3 rounded-lg border text-center ${
                    isCrit ? 'bg-red-50 border-red-200 text-red-950' :
                    isHigh ? 'bg-orange-50 border-orange-200 text-orange-950' :
                    isMed ? 'bg-amber-50 border-amber-200 text-amber-950' :
                    'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-slate-500">
                      {st.name}
                    </span>
                    <span className={`text-2xl font-black font-mono my-1 block ${
                      isCrit ? 'text-red-700' : isHigh ? 'text-orange-700' : isMed ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {st.prob}%
                    </span>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden my-1.5">
                      <div
                        className={`h-full rounded-full ${
                          isCrit ? 'bg-red-600' : isHigh ? 'bg-orange-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${st.prob}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate" title={st.desc}>
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10 Core Problem Statement Parameters Grid */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  10 Core Influencing Variables (Predictive Risk Feature Matrix)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Multifaceted operational variables analyzed by gradient boosting models for early bottleneck identification
                </p>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                Feature Space: 10 Dimensions
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">1. Project Type</span>
                <span className="font-bold text-slate-900 text-xs mt-1 block">{project.projectType}</span>
                <span className="text-[10px] text-slate-400">{project.statutoryAct}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">2. Land Area</span>
                <span className="font-bold font-mono text-slate-900 text-xs mt-1 block">{project.totalLandRequiredHa} Ha</span>
                <span className="text-[10px] text-slate-500">{project.landAcquiredHa} Ha acquired</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">3. Affected Families</span>
                <span className="font-bold font-mono text-slate-900 text-xs mt-1 block">{project.affectedFamilies} Families</span>
                <span className="text-[10px] text-slate-500">{project.familiesRehabilitated} settled</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">4. Compensation Status</span>
                <span className="font-bold font-mono text-slate-900 text-xs mt-1 block">₹{project.compensationDisbursedCr} / ₹{project.compensationAwardedCr} Cr</span>
                <span className="text-[10px] text-red-600 font-semibold">{((1 - (project.compensationDisbursedCr / (project.compensationAwardedCr || 1))) * 100).toFixed(0)}% pending</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">5. Approval Timelines</span>
                <span className="font-bold font-mono text-slate-900 text-xs mt-1 block">{project.daysAtCurrentStage} Days in Stage</span>
                <span className="text-[10px] text-slate-500 truncate block" title={project.currentStageName || project.currentStage}>{project.currentStageName || project.currentStage}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">6. Legal Disputes</span>
                <span className={`font-bold font-mono text-xs mt-1 block ${project.activeCourtCases > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {project.activeCourtCases} Active Cases
                </span>
                <span className="text-[10px] text-slate-500">HC Writs & Sec 3G(5)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">7. Possession Status</span>
                <span className="font-bold font-mono text-slate-900 text-xs mt-1 block">{project.progressPercentage}% RoW Taken</span>
                <span className="text-[10px] text-slate-500">{project.landPossessionHa} Ha cleared</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">8. Rehabilitation Progress</span>
                <span className="font-bold font-mono text-slate-900 text-xs mt-1 block">
                  {Math.round((project.familiesRehabilitated / (project.affectedFamilies || 1)) * 100)}% Resettled
                </span>
                <span className="text-[10px] text-slate-500">{project.affectedFamilies - project.familiesRehabilitated} pending colony</span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-900 block">9. Stakeholder Responsiveness</span>
                <span className="font-bold font-mono text-blue-950 text-xs mt-1 block">
                  {project.stakeholderResponsivenessScore ?? 68.5} / 100
                </span>
                <span className="text-[10px] text-blue-800">Line departments latency index</span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-900 block">10. Historical Performance</span>
                <span className="font-bold font-mono text-blue-950 text-xs mt-1 block">
                  {project.historicalPerformanceRating ?? 'TIER_B_AVERAGE'}
                </span>
                <span className="text-[10px] text-blue-800">Avg cycle: {project.historicalAvgClearanceDays ?? 110} days</span>
              </div>
            </div>
          </div>

          {/* Inter-Departmental Coordination Status */}
          {project.pendingInterDepartmentalApprovals && (
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Inter-Departmental Coordination & Statutory NOC Status
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Cross-ministry clearances tracked across Forest, Wildlife, Railways, and Local Authorities
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Coordination Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {project.pendingInterDepartmentalApprovals.map((appr, aIdx) => (
                  <div key={aIdx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{appr.clearance}</span>
                      <span className="text-[11px] text-slate-500">{appr.agency}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      appr.status === 'CLEARED' ? 'bg-emerald-100 text-emerald-800' :
                      appr.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {appr.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ACQUISITION STAGE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Statutory Acquisition Stage Pipeline (RFCTLARR 2013 & NH Act 1956)
            </h3>
            <p className="text-xs text-slate-500">
              Detailed tracking of statutory stage cycle times, statutory benchmarks, and bottlenecks
            </p>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              const isDone = stage.status === 'COMPLETED';
              const isAtRisk = stage.status === 'AT_RISK';
              const isDelayed = stage.status === 'DELAYED';

              return (
                <div
                  key={stage.sequence}
                  className={`p-4 rounded-lg border transition-all ${
                    isAtRisk
                      ? 'border-red-300 bg-red-50/40'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDone
                            ? 'bg-emerald-700 text-white'
                            : isAtRisk
                            ? 'bg-red-700 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : stage.sequence}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {stage.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500">
                          {stage.statutoryRef}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Benchmark</span>
                        <span className="font-mono text-slate-700">{stage.benchmarkDays} Days</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Elapsed</span>
                        <span className={`font-mono font-bold ${stage.daysDelayed > 0 ? 'text-red-700' : 'text-slate-900'}`}>
                          {stage.daysElapsed} Days
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isAtRisk
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 pl-10">
                    <span className="font-semibold text-slate-700">Milestone Notes:</span> {stage.bottleneckSummary}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: EXPLAINABLE AI (SHAP) + WHAT-IF SIMULATOR */}
      {activeTab === 'shap' && (
        <div className="space-y-6">
          {/* SHAP Feature Contribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-900" />
                  <span>Explainable AI (TreeSHAP) &mdash; Why is this project at risk?</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Feature attribution showing relative positive (+ risk) and negative (- risk) impacts on overall delay
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200">
                Baseline Risk: {shapExplanation?.baseDelayProbability}% &rarr; Final Risk: {project.delayProbability}%
              </span>
            </div>

            <div className="space-y-3">
              {shapExplanation?.features?.map((feat, idx) => {
                const isIncreasing = feat.direction === 'INCREASES_DELAY';
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isIncreasing
                        ? (feat.impact === 'CRITICAL' ? 'bg-red-50/50 border-red-200' : 'bg-orange-50/50 border-orange-200')
                        : 'bg-emerald-50/50 border-emerald-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{feat.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/80 border border-slate-300">
                          {feat.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 font-medium">
                        Evidence: {feat.evidence}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isIncreasing ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isIncreasing ? `+ Increases Delay Risk` : `- Reduces Delay Risk`}
                      </span>
                      <span className="font-mono font-bold text-sm w-16 text-right">
                        {isIncreasing ? `+${(feat.shapValue * 100).toFixed(1)}%` : `${(feat.shapValue * 100).toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Policy Counterfactual Simulator */}
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border-2 border-blue-300 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-900" />
                  <span>Interactive Policy Counterfactual Simulator ("What-If" Analysis)</span>
                </h3>
                <p className="text-xs text-blue-900 font-medium">
                  Test hypothetical administrative interventions to observe immediate projected reduction in delay days
                </p>
              </div>
              <span className="text-[10px] font-bold bg-blue-900 text-white px-2 py-1 rounded tracking-wider uppercase font-mono">
                Prescriptive Engine Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1 */}
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Disburse Pending Compensation</span>
                  <span className="text-blue-900 font-mono font-black text-sm">+{compBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={compBoost}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCompBoost(val);
                    handleRunSimulation(val, courtResolved, stageExpedite);
                  }}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Simulates releasing ₹{Math.round((compBoost / 100) * project.calaAccountBalanceCr)} Cr from CALA escrow
                </span>
              </div>

              {/* Slider 2 */}
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Resolve Court Cases via Lok Adalat</span>
                  <span className="text-blue-900 font-mono font-black text-sm">{courtResolved} Cases</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(project.activeCourtCases, 10)}
                  step="1"
                  value={courtResolved}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCourtResolved(val);
                    handleRunSimulation(compBoost, val, stageExpedite);
                  }}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Vacates stays on {courtResolved * 2.4} Hectares alignment
                </span>
              </div>

              {/* Slider 3 */}
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Expedite Stage Verification</span>
                  <span className="text-blue-900 font-mono font-black text-sm">-{stageExpedite} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  step="5"
                  value={stageExpedite}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setStageExpedite(val);
                    handleRunSimulation(compBoost, courtResolved, val);
                  }}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Accelerates Revenue mutation verification camps
                </span>
              </div>
            </div>

            {/* Simulation Outcomes Display */}
            {simResult && (
              <div className="bg-white rounded-lg border border-blue-300 p-5 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Original Risk</span>
                    <span className="text-xl font-bold font-mono text-red-700 block mt-1">
                      {simResult.original.delayProbability}%
                    </span>
                    <span className="text-xs text-slate-500">+{simResult.original.predictedDelayDays} Days Delay</span>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-blue-900 block">Simulated Post-Intervention</span>
                    <span className="text-xl font-bold font-mono text-blue-950 block mt-1">
                      {simResult.simulated.delayProbability}%
                    </span>
                    <span className="text-xs text-blue-700">+{simResult.simulated.predictedDelayDays} Days Delay</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">Net Days Saved</span>
                    <span className="text-2xl font-black font-mono text-emerald-800 block mt-1">
                      -{simResult.impact.delayDaysSaved} <span className="text-xs font-normal">Days</span>
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">Timeline Acceleration</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">Risk Reduction</span>
                    <span className="text-2xl font-black font-mono text-emerald-800 block mt-1">
                      -{simResult.impact.riskPercentageReduction}%
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">Drop in Delay Probability</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">
                    Statutory Action Restoring Project Schedule: <strong>Schedule Special CALA Lok Adalat on 10th October</strong>
                  </span>
                  <button
                    onClick={() => onNavigate('recommendations')}
                    className="px-3 py-1.5 bg-blue-900 text-white rounded font-bold hover:bg-blue-950"
                  >
                    View Official Interventions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: GIS ALIGNMENT */}
      {activeTab === 'gis' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Spatial Alignment Route & Affected Parcels
              </h3>
              <p className="text-xs text-slate-500">
                Coordinates: {project.centroidLat.toFixed(4)} N, {project.centroidLng.toFixed(4)} E &bull; Section Chainage
              </p>
            </div>
            <button
              onClick={() => onNavigate('gis')}
              className="px-3 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open Full-Screen GIS</span>
            </button>
          </div>

          <div className="h-80 w-full rounded-lg border border-slate-300 bg-slate-100 flex items-center justify-center p-4">
            <div className="text-center text-slate-600 space-y-2">
              <MapPin className="w-8 h-8 text-blue-900 mx-auto" />
              <p className="font-bold text-sm text-slate-900">
                Interactive GIS Layer Active for {project.id}
              </p>
              <p className="text-xs max-w-md mx-auto text-slate-500">
                Centroid: [{project.centroidLat}, {project.centroidLng}] &bull; {project.routePoints?.length || 4} alignment polyline vertices &bull; {parcels.length} survey khata parcels mapped
              </p>
              <button
                onClick={() => onNavigate('gis')}
                className="mt-2 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded hover:bg-blue-950 shadow-xs"
              >
                Launch Spatial Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: COMPENSATION LEDGER */}
      {activeTab === 'compensation' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Khata-wise Landowner Award & PFMS Disbursement Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  CALA Escrow Account Balance: ₹{project.calaAccountBalanceCr} Cr &bull; Section 3G(1) Awards
                </p>
              </div>

              <div className="flex items-center gap-2">
                {disburseSuccess && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PFMS Batch Transmitted!
                  </span>
                )}
                <button
                  onClick={handleDisburseBatch}
                  disabled={disbursing}
                  className="px-3 py-2 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  {disbursing ? 'Processing PFMS...' : 'Initiate Batch PFMS Disbursement'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3 py-2.5">Khata / Survey No</th>
                    <th className="px-3 py-2.5">Village & Taluk</th>
                    <th className="px-3 py-2.5">Landowner Name</th>
                    <th className="px-3 py-2.5">Land Type</th>
                    <th className="px-3 py-2.5">Area (Ha)</th>
                    <th className="px-3 py-2.5">Award (₹)</th>
                    <th className="px-3 py-2.5">Disbursed (₹)</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {parcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-mono font-bold text-blue-950">
                        {parcel.khataNo} / {parcel.surveyNo}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold">{parcel.village}</div>
                        <div className="text-[10px] text-slate-500">{parcel.taluk}</div>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">
                        {parcel.ownerName}
                      </td>
                      <td className="px-3 py-2.5">{parcel.landType}</td>
                      <td className="px-3 py-2.5 font-mono">{parcel.areaHa}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-900">₹{(parcel.awardAmount / 100000).toFixed(1)} L</td>
                      <td className="px-3 py-2.5 font-mono font-bold text-emerald-800">
                        ₹{(parcel.disbursedAmount / 100000).toFixed(1)} L
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          parcel.status === 'POSSESSION_TAKEN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : (parcel.status === 'DISPUTED_STAY' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')
                        }`}>
                          {parcel.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: LEGAL & R&R */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Judicial Litigations, High Court Stays & Section 3G(5) Arbitrations
            </h3>

            <div className="space-y-3">
              {legalCases.map((c) => (
                <div key={c.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-blue-950">{c.caseNumber}</span>
                      <span className="ml-2 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-300">
                        {c.courtForum}
                      </span>
                    </div>
                    {c.stayGranted && (
                      <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        STAY ORDER ACTIVE ({c.caseAgeDays} DAYS)
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-slate-700">
                    <strong>Petitioner:</strong> {c.petitioner} &bull; <strong>Land Blocked:</strong> {c.landBlockedHa} Ha at Chainage {c.chainageAffected}
                  </p>
                  <p className="mt-1 text-slate-500 font-medium">
                    Status: {c.status} &bull; Next Hearing: {c.nextHearingDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Rehabilitation & Resettlement (R&R) Family Entitlements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {rrCases.map((rr) => (
                <div key={rr.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-900">{rr.familyHead}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{rr.village}</div>
                  <div className="mt-2 text-blue-900 font-medium">{rr.entitlementType}</div>
                  <div className="mt-1 font-mono font-bold text-slate-800">Cash Grant: ₹{rr.cashGrant.toLocaleString()}</div>
                  <div className="mt-2">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {rr.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Statutory Gazette Notifications & Land Records
          </h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{doc.title}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                    {doc.gazetteNo} &bull; {doc.date} &bull; {doc.fileSize}
                  </div>
                  <div className="text-emerald-700 font-mono text-[10px] mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{doc.digitalSignature}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Opening statutory gazette publication: ${doc.gazetteNo}`)}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded font-bold hover:bg-blue-950 shadow-xs"
                >
                  View Gazette PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Project Early Warning Escalations
          </h3>
          <div className="p-4 rounded-lg border border-red-300 bg-red-50 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-950 text-sm">
                Severe Disbursement Lag: ₹480 Cr CALA Balance Unpaid &gt; 90 Days
              </span>
              <RiskBadge level="CRITICAL" showScore={false} size="sm" />
            </div>
            <p className="text-red-900 mt-2 leading-relaxed">
              Out of ₹1,120 Cr awarded under Section 3G, only ₹640 Cr has been disbursed. 43% remains pending due to title dispute affidavits and PFMS KYC mismatch in Sriperumbudur taluk.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => onNavigate('alerts')}
                className="px-3 py-1.5 bg-red-700 text-white rounded font-bold hover:bg-red-800"
              >
                Acknowledge Alert in Alert Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Prescriptive Interventions & Decision Recording
              </h3>
              <p className="text-xs text-slate-500">
                AI-generated recommendation &mdash; final decision rests with authorized officer under statutory authority.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-blue-200 bg-blue-50/50 space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-bold text-sm text-blue-950">
                  Establish Fast-Track CALA Lok Adalat for Joint Khata Disputes
                </span>
                <span className="ml-2 font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Saves ~38 Days
                </span>
              </div>
              <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px]">
                APPROVED BY COLLECTOR
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Machine learning identifies that 48 joint khata heirship claims are responsible for 41.2% of the pending ₹480 Cr compensation backlog in Sriperumbudur taluk. Resolving this will unlock possession for 16.4 critical chainage hectares.
            </p>

            <div className="pt-2 border-t border-blue-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">
                Officer In-Charge: <strong>Thiru S. Murugesan (CALA / DRO)</strong> &bull; Scheduled: <strong>10th October</strong>
              </span>
              <button
                onClick={() => handleAcceptRecommendation('REC-2026-01')}
                className="px-3 py-1.5 bg-blue-900 text-white rounded font-bold hover:bg-blue-950 shadow-xs"
              >
                Re-Confirm Execution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Immutable Administrative Audit Trail for {project.id}
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Smt. P. Divya, IAS (District Collector)</span>
                <span className="text-slate-500 ml-2">Approved Special Lok Adalat session</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">2026-09-22 09:15:22 UTC</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Thiru S. Murugesan (CALA / DRO)</span>
                <span className="text-slate-500 ml-2">Processed PFMS batch CMP-TN-41 (₹18.4 Cr)</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">2026-09-21 16:40:10 UTC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
