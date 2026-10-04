import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import GovHeader from './components/common/GovHeader';
import GovSidebar from './components/common/GovSidebar';
import UniversalNavigationBanner from './components/common/UniversalNavigationBanner';

// Operational Views
import PortalGateway from './views/PortalGateway';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import ProjectsDirectory from './views/ProjectsDirectory';
import ProjectDetailProfile from './views/ProjectDetailProfile';
import GisCommandCenter from './views/GisCommandCenter';
import AlertCenter from './views/AlertCenter';
import RecommendationEngine from './views/RecommendationEngine';
import CompensationLedger from './views/CompensationLedger';
import LegalRrTracker from './views/LegalRrTracker';
import DocumentRepository from './views/DocumentRepository';
import AnalyticsReports from './views/AnalyticsReports';
import ModelGovernance from './views/ModelGovernance';
import AdminAuditLog from './views/AdminAuditLog';
import GovernmentDirectory from './views/GovernmentDirectory';

import {
  Landmark,
  Building2,
  Phone,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

function MainApp() {
  const { t } = useAuth();
  const [currentView, setCurrentView] = useState('gateway'); // Default to statutory gateway overview
  const [selectedProjectId, setSelectedProjectId] = useState('NHAI-TN-BCE-04');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Navigation History Stacks
  const [history, setHistory] = useState([]);
  const [forwardStack, setForwardStack] = useState([]);

  // Human-readable titles for views
  const getViewTitle = (viewId, projId) => {
    switch (viewId) {
      case 'gateway': return t('portalOverview') || 'Portal Gateway';
      case 'dashboard': return t('dashboard') || 'Executive Dashboard';
      case 'projects': return t('projects') || 'Projects Directory';
      case 'project_detail': return `Project Detail (${projId || selectedProjectId})`;
      case 'gis': return t('gis') || 'GIS Command Center';
      case 'alerts': return t('alerts') || 'Alert Center';
      case 'recommendations': return t('recommendations') || 'AI Recommendations';
      case 'compensation': return t('compensation') || 'Compensation Ledger';
      case 'legal': return t('legal') || 'Legal & R&R Disputes';
      case 'documents': return t('documents') || 'Document Repository';
      case 'analytics': return t('analytics') || 'Analytics & Reports';
      case 'model': return t('modelGov') || 'Model Governance';
      case 'audit': return t('audit') || 'Admin Audit Log';
      case 'government_directory': return t('govtDirectory') || 'Government Directory';
      default: return 'Portal View';
    }
  };

  const handleNavigate = (view) => {
    if (view === currentView) return;
    setHistory(prev => [...prev, { view: currentView, projectId: selectedProjectId }]);
    setForwardStack([]);
    setCurrentView(view);
    try {
      window.history.pushState({ view, projectId: selectedProjectId }, '', `#${view}`);
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (projectId) => {
    if (projectId === selectedProjectId && currentView === 'project_detail') return;
    setHistory(prev => [...prev, { view: currentView, projectId: selectedProjectId }]);
    setForwardStack([]);
    setSelectedProjectId(projectId);
    setCurrentView('project_detail');
    try {
      window.history.pushState({ view: 'project_detail', projectId }, '', `#project-${projectId}`);
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const prevItem = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setForwardStack(prev => [{ view: currentView, projectId: selectedProjectId }, ...prev]);
      setCurrentView(prevItem.view);
      if (prevItem.projectId) {
        setSelectedProjectId(prevItem.projectId);
      }
    } else if (currentView !== 'gateway') {
      // If entered a sub-view directly or history is empty, fall back to gateway
      setForwardStack(prev => [{ view: currentView, projectId: selectedProjectId }, ...prev]);
      setCurrentView('gateway');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoForward = () => {
    if (forwardStack.length > 0) {
      const nextItem = forwardStack[0];
      setForwardStack(prev => prev.slice(1));
      setHistory(prev => [...prev, { view: currentView, projectId: selectedProjectId }]);
      setCurrentView(nextItem.view);
      if (nextItem.projectId) {
        setSelectedProjectId(nextItem.projectId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Synchronize browser popstate (back/forward hardware or browser buttons)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.projectId) {
          setSelectedProjectId(event.state.projectId);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const canGoBack = history.length > 0 || currentView !== 'gateway';
  const canGoForward = forwardStack.length > 0;

  const previousEntry = history.length > 0
    ? history[history.length - 1]
    : (currentView !== 'gateway' ? { view: 'gateway', projectId: selectedProjectId } : null);

  const previousViewName = previousEntry ? getViewTitle(previousEntry.view, previousEntry.projectId) : '';
  const currentViewName = getViewTitle(currentView, selectedProjectId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-900 selection:text-white">
      {/* 1. Official Government Header */}
      <GovHeader
        onNavigate={handleNavigate}
        onGoBack={handleGoBack}
        canGoBack={canGoBack}
        activeAlertsCount={4}
      />

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Institutional Sidebar */}
        <GovSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic View Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {/* Universal Top Navigation & Back Bar */}
            <UniversalNavigationBanner
              currentView={currentView}
              currentViewName={currentViewName}
              previousViewName={previousViewName}
              canGoBack={canGoBack}
              onGoBack={handleGoBack}
              canGoForward={canGoForward}
              onGoForward={handleGoForward}
              onNavigateHome={() => handleNavigate('gateway')}
            />

            {currentView === 'gateway' && (
              <PortalGateway onNavigate={handleNavigate} />
            )}
            {currentView === 'dashboard' && (
              <ExecutiveDashboard
                onNavigate={handleNavigate}
                onSelectProject={handleSelectProject}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'projects' && (
              <ProjectsDirectory
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'project_detail' && (
              <ProjectDetailProfile
                projectId={selectedProjectId}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'gis' && (
              <GisCommandCenter
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'alerts' && (
              <AlertCenter
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'recommendations' && (
              <RecommendationEngine
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'compensation' && (
              <CompensationLedger
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'legal' && (
              <LegalRrTracker
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'documents' && (
              <DocumentRepository
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'analytics' && (
              <AnalyticsReports
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'model' && (
              <ModelGovernance
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'audit' && (
              <AdminAuditLog
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
            {currentView === 'government_directory' && (
              <GovernmentDirectory
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
              />
            )}
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. OFFICIAL PROMINENT GOVERNMENT FOOTER */}
      {/* ======================================================== */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 no-print">
        {/* Prominent Government Directory Highlight Banner */}
        <div className="border-b border-slate-800 bg-[#081323] px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base tracking-tight">
                    Government Directory
                  </span>
                  <span className="text-[10px] font-mono bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">
                    Official Reference
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Union Ministers, Ministries & Official Government Contacts
                </p>
              </div>
            </div>

            <button
              onClick={() => handleNavigate('government_directory')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Landmark className="w-4 h-4 text-slate-950" />
              <span>Open Government Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Institutional Footer Links */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            {/* Column 1: Identity & Description */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 font-black text-sm tracking-tight text-white">
                <span>LandGuard AI</span>
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-normal">
                  v2.4
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Predictive Land Acquisition Risk Management
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg pt-1">
                “Government information shown in this directory is sourced from publicly available official government sources.”
              </p>
              <div className="pt-1">
                <span className="inline-block text-[10px] font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
                  LandGuard AI Prototype / Demonstration System
                </span>
              </div>
            </div>

            {/* Column 2: Government Directory Quick Access */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>Government Directory</span>
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => handleNavigate('government_directory')}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    Union Council of Ministers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('government_directory')}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    Ministries & Departments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('government_directory')}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    Official Contacts Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('government_directory')}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    Verification Sources
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Institutional Governance & Policies */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Institutional Links</span>
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => handleNavigate('gateway')}
                    className="hover:text-slate-200 transition-colors text-left"
                  >
                    About LandGuard AI
                  </button>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-slate-200 transition-colors">
                    Accessibility Statement
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-slate-200 transition-colors">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-slate-200 transition-colors">
                    Terms & Conditions
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Micro-Copyright & Jurisdiction Line */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
            <div>
              Ministry of Road Transport & Highways &bull; Department of Land Resources (DoLR, MoRD) &bull; National Informatics Centre (NIC)
            </div>
            <div className="text-slate-400 font-mono text-[10px]">
              Strictly Factual &bull; Non-Partisan Government Public Record
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
