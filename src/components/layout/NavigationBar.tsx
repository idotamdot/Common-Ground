import React from 'react';
import { Layers, GitMerge, Activity, ScanEye } from 'lucide-react';

export type NavTabId = 'feed' | 'resolve' | 'radar' | 'lens';

export interface NavigationBarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  id?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onSelectTab,
  id = 'bottom-navigation-bar',
}) => {
  const tabs: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'feed', label: 'Common Ground', icon: Layers },
    { id: 'resolve', label: 'Build Bridge', icon: GitMerge },
    { id: 'radar', label: 'Global Pulse', icon: Activity },
    { id: 'lens', label: 'Propaganda Lens', icon: ScanEye },
  ];

  return (
    <nav
      id={id}
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/90 px-3 py-2 sm:py-3 transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-selected={isActive}
              role="tab"
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center gap-1 rounded-xl px-2 transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-cyan-400' : 'text-zinc-400'
                }`}
                aria-hidden="true"
              />
              <span className="text-[11px] font-mono tracking-tight whitespace-nowrap leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
