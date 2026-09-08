import React from 'react';
import { Fingerprint, ShieldCheck, Share2 } from 'lucide-react';
import { User } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

export interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onOpenShareApp: () => void;
  pendingSyncCount: number;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onOpenShareApp,
  pendingSyncCount,
  isOnline,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 py-3 transition-colors"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-mono font-bold tracking-tight text-zinc-100 leading-tight">
                COMMON GROUND
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-pink-500/15 text-pink-400 border border-pink-500/30">
                GLOBAL
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-[180px] sm:max-w-xs">
              De-escalate propaganda • Work with, not against
            </p>
          </div>
        </div>

        {/* Live sync indicator & Passkey auth triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            {!isOnline ? (
              <StatusBadge status="OFFLINE" label="Offline WAL" pulsate />
            ) : pendingSyncCount > 0 ? (
              <StatusBadge status="SYNCING" label={`Syncing (${pendingSyncCount})`} pulsate />
            ) : (
              <StatusBadge status="ONLINE" label="Cloud Synced" />
            )}
          </div>

          <Button
            id="header-share-trigger"
            variant="outline"
            size="sm"
            onClick={onOpenShareApp}
            aria-label="Share platform with friends"
            className="hidden xs:inline-flex"
            leftIcon={<Share2 className="w-4 h-4 text-cyan-400" aria-hidden="true" />}
          >
            Share
          </Button>

          {user ? (
            <button
              id="header-user-profile-btn"
              type="button"
              onClick={onOpenAuth}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-zinc-900 border border-cyan-500/30 flex items-center gap-2 text-zinc-200 hover:border-cyan-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label={`Logged in as ${user.display_name}. Open Passkey settings`}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-mono font-medium hidden md:inline truncate max-w-[100px]">
                {user.display_name}
              </span>
              <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
            </button>
          ) : (
            <Button
              id="header-passkey-login-btn"
              variant="primary"
              size="sm"
              onClick={onOpenAuth}
              leftIcon={<Fingerprint className="w-4 h-4" aria-hidden="true" />}
            >
              Passkey
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
