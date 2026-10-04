import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Breadcrumbs({ items = [], onNavigate, onGoBack }) {
  const auth = useAuth();
  const t = auth?.t || ((k) => (k === 'back' ? 'Back' : k === 'portalHome' ? 'Portal Home' : k));

  return (
    <nav className="flex items-center flex-wrap gap-2 text-xs text-slate-600 mb-4 font-medium" aria-label="Breadcrumb">
      {onGoBack && (
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer mr-2 touch-manipulation"
          title="Go to previous page"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('back')}</span>
        </button>
      )}

      <button
        onClick={() => onNavigate && onNavigate('gateway')}
        className="flex items-center gap-1 hover:text-blue-900 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{t('portalHome')}</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold truncate max-w-xs md:max-w-md">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate && onNavigate(item.view, item.params)}
                className="hover:text-blue-900 transition-colors truncate max-w-xs cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
