import React from 'react';

export interface StatusBadgeProps {
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'VERIFIED' | 'DISPUTED' | 'LOCAL';
  label?: string;
  pulsate?: boolean;
  className?: string;
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulsate = false,
  className = '',
  id,
}) => {
  const configs = {
    ONLINE: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      text: label || 'Cloud Synced',
    },
    OFFLINE: {
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
      text: label || 'Offline Safe',
    },
    SYNCING: {
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      dot: 'bg-cyan-400',
      text: label || 'Syncing WAL...',
    },
    VERIFIED: {
      color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
      dot: 'bg-cyan-300',
      text: label || 'Passkey Verified',
    },
    DISPUTED: {
      color: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      dot: 'bg-pink-400',
      text: label || 'Under Mediation',
    },
    LOCAL: {
      color: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80',
      dot: 'bg-zinc-400',
      text: label || 'Local Snapshot',
    },
  }[status];

  return (
    <span
      id={id}
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md whitespace-nowrap select-none ${configs.color} ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${configs.dot} ${
          pulsate || status === 'SYNCING' ? 'animate-ping opacity-75' : ''
        }`}
        aria-hidden="true"
      />
      <span className="truncate">{configs.text}</span>
    </span>
  );
};
