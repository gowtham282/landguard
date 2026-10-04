import React from 'react';
import { AlertOctagon, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export default function RiskBadge({ level, score, showScore = true, size = 'md' }) {
  const normalized = (level || 'LOW').toUpperCase();

  const configs = {
    CRITICAL: {
      bg: 'bg-red-50 text-red-800 border-red-300',
      dot: 'bg-red-600',
      icon: AlertOctagon,
      label: 'CRITICAL RISK',
    },
    HIGH: {
      bg: 'bg-orange-50 text-orange-800 border-orange-300',
      dot: 'bg-orange-600',
      icon: AlertTriangle,
      label: 'HIGH RISK',
    },
    MEDIUM: {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-600',
      icon: Clock,
      label: 'MEDIUM RISK',
    },
    LOW: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-600',
      icon: CheckCircle2,
      label: 'LOW RISK',
    },
  };

  const config = configs[normalized] || configs.LOW;
  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md shadow-xs ${config.bg} ${
        isSmall ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5'
      }`}
      title={`Risk Category: ${config.label}${score !== undefined ? ` (Score: ${score}/100)` : ''}`}
    >
      <Icon className={isSmall ? 'w-3 h-3 text-current' : 'w-3.5 h-3.5 text-current'} />
      <span className="font-semibold tracking-wide">{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded border border-current/20 font-mono text-[11px]">
          {typeof score === 'number' ? score.toFixed(1) : score}%
        </span>
      )}
    </span>
  );
}
