import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  MapPin,
  AlertTriangle,
  Lightbulb,
  CreditCard,
  Scale,
  FileText,
  BarChart3,
  Cpu,
  History,
  Compass,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Landmark
} from 'lucide-react';

export default function GovSidebar({ currentView, onNavigate, isCollapsed, onToggleCollapse }) {
  const { t } = useAuth();

  const navItems = [
    { id: 'gateway', label: t('portalOverview'), icon: Compass },
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'projects', label: t('projects'), icon: FolderGit2 },
    { id: 'gis', label: t('gis'), icon: MapPin },
    { id: 'alerts', label: t('alerts'), icon: AlertTriangle, badge: '4' },
    { id: 'recommendations', label: t('recommendations'), icon: Lightbulb },
    { id: 'compensation', label: t('compensation'), icon: CreditCard },
    { id: 'legal', label: t('legal'), icon: Scale },
    { id: 'documents', label: t('documents'), icon: FileText },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    { id: 'model', label: t('modelGov'), icon: Cpu },
    { id: 'audit', label: t('audit'), icon: History },
    { id: 'government_directory', label: t('govtDirectory'), icon: Landmark },
  ];

  return (
    <aside
      className={`bg-[#0f2e5a] text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 shrink-0 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div>
        {/* Sidebar Header with Collapse Toggle */}
        <div className="h-12 border-b border-slate-800/80 px-3 flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              {t('adminModules')}
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
            title={isCollapsed ? "Expand Navigation" : "Collapse Navigation"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-blue-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-950' : 'text-slate-400'}`} />
                {!isCollapsed && (
                  <span className="truncate tracking-tight flex-1 text-left">
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-red-700 text-white' : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Statutory Footer Badge */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 text-[10px] text-slate-400 bg-slate-950/40">
          <div className="font-semibold text-slate-300 mb-0.5">
            Statutory Architecture:
          </div>
          <div>&bull; RFCTLARR Act, 2013</div>
          <div>&bull; National Highways Act, 1956</div>
          <div>&bull; BhoomiRashi & LACRRIS Aligned</div>
          <div className="mt-2 text-amber-400/80 font-mono text-[9px]">
            v2.4.1 &bull; NIC Node Secured
          </div>
        </div>
      )}
    </aside>
  );
}
