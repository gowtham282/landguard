import React from 'react';

export default function StatCard({
  title,
  value,
  unit = '',
  subtitle = '',
  icon: Icon,
  variant = 'default', // 'default' | 'danger' | 'warning' | 'success' | 'info'
  onClick
}) {
  const variantStyles = {
    default: 'border-slate-200 bg-white text-slate-900',
    danger: 'border-red-200 bg-red-50/50 text-red-950',
    warning: 'border-amber-200 bg-amber-50/50 text-amber-950',
    success: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
    info: 'border-blue-200 bg-blue-50/50 text-blue-950',
  };

  const iconBgStyles = {
    default: 'bg-slate-100 text-slate-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    success: 'bg-emerald-100 text-emerald-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-4 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''
      } ${variantStyles[variant] || variantStyles.default}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 truncate">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-md ${iconBgStyles[variant] || iconBgStyles.default}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-600 flex items-center gap-1 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
