import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  ChevronRight,
  Compass
} from 'lucide-react';

export default function UniversalNavigationBanner({
  currentView,
  currentViewName,
  previousViewName,
  canGoBack,
  onGoBack,
  canGoForward,
  onGoForward,
  onNavigateHome
}) {
  const { t } = useAuth();

  if (!canGoBack && currentView === 'gateway') {
    return null;
  }

  return (
    <div className="mb-4 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 sm:p-3 px-3 sm:px-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 transition-all">
      {/* Left: Prominent Touch-Friendly Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Prominent Back Button */}
        <button
          onClick={onGoBack}
          className="group inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
          title={t('previousPage') || 'Go to previous page'}
          aria-label={t('previousPage') || 'Previous page'}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 shrink-0" />
          <span className="font-bold">{t('back') || 'Back'}</span>
          {previousViewName && (
            <span className="hidden md:inline text-blue-200 font-normal pl-1.5 border-l border-blue-700/60 max-w-[200px] truncate">
              {previousViewName}
            </span>
          )}
        </button>

        {/* Interactive Breadcrumb Trail */}
        <nav aria-label="Breadcrumb navigation" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-600 hover:text-blue-900 hover:underline transition-colors shrink-0 cursor-pointer"
            title={t('portalHome') || 'Portal Home'}
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">{t('portalHome') || 'Portal Home'}</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

          {previousViewName && (
            <>
              <button
                onClick={onGoBack}
                className="text-slate-600 hover:text-blue-900 hover:underline transition-colors truncate max-w-[140px] md:max-w-[220px] cursor-pointer"
                title={`Go back to ${previousViewName}`}
              >
                {previousViewName}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            </>
          )}

          <span className="text-blue-950 font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200/80 truncate max-w-[160px] md:max-w-[240px]">
            {currentViewName}
          </span>
        </nav>
      </div>

      {/* Right: Forward & Quick Home jump */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        {canGoForward && (
          <button
            onClick={onGoForward}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-300 active:scale-95 cursor-pointer touch-manipulation"
            title="Go forward"
            aria-label="Go forward"
          >
            <span className="hidden sm:inline">Forward</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-950 rounded-lg text-xs font-semibold transition-colors border border-slate-200 hover:border-slate-300 active:scale-95 cursor-pointer touch-manipulation"
          title={t('portalOverview') || 'Portal Gateway'}
        >
          <Compass className="w-3.5 h-3.5 text-blue-900" />
          <span className="hidden sm:inline">{t('portalOverview') || 'Gateway'}</span>
        </button>
      </div>
    </div>
  );
}
