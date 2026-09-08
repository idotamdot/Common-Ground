import React, { useState, useMemo } from 'react';
import { Search, Plus, Share2, Sparkles, ShieldCheck, Heart, Trash2 } from 'lucide-react';
import { BridgeRecord } from '../../../types';
import { StatusBadge } from '../../ui/StatusBadge';
import { Button } from '../../ui/Button';

export interface RecordListProps {
  bridges: BridgeRecord[];
  onOpenCreate: () => void;
  onOpenShare: (bridge: BridgeRecord) => void;
  onDeleteBridge: (id: string) => void;
}

export const RecordList: React.FC<RecordListProps> = ({
  bridges,
  onOpenCreate,
  onOpenShare,
  onDeleteBridge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedSide, setExpandedSide] = useState<Record<string, 'A' | 'B' | 'SYNTHESIS'>>({});

  const filteredBridges = useMemo(() => {
    return bridges.filter((item) => {
      const matchesSearch =
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.common_ground_statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.side_a.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.side_b.label.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [bridges, searchQuery, selectedCategory]);

  const categories = [
    { id: 'ALL', label: 'All Accords' },
    { id: 'GLOBAL_CONFLICT', label: 'Global Conflict' },
    { id: 'RESOURCE_SHARING', label: 'Resources & Climate' },
    { id: 'NEIGHBORHOOD_ACCORD', label: 'Local Communities' },
    { id: 'ECONOMIC_SYSTEMS', label: 'Labor & Economics' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Create Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Verified Accords</span>
            <span className="text-sm font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {filteredBridges.length} active
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Real global disputes decoded into foundational human needs and mutual solutions.
          </p>
        </div>

        <Button
          id="create-bridge-btn"
          variant="primary"
          onClick={onOpenCreate}
          leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
        >
          Resolve a Conflict
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search perspectives, common ground, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-sm font-semibold'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Virtualized/Interactive List */}
      <div className="grid grid-cols-1 gap-5">
        {filteredBridges.map((bridge) => {
          const activeSide = expandedSide[bridge.id] || 'SYNTHESIS';

          return (
            <article
              key={bridge.id}
              id={`bridge-card-${bridge.id}`}
              className="p-5 sm:p-6 rounded-2xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 shadow-lg flex flex-col gap-4 relative transition-all hover:border-zinc-700"
            >
              {/* Card Meta Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-cyan-400 border border-zinc-700">
                    {bridge.category.replace(/_/g, ' ')}
                  </span>
                  <StatusBadge
                    status={bridge.status === 'SYNCED' ? 'ONLINE' : 'LOCAL'}
                    label={bridge.status === 'SYNCED' ? 'Reconciled' : 'Offline WAL'}
                  />
                  {bridge.verified_by_passkey && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      Passkey Sealed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-mono text-zinc-400 block">Consensus</span>
                    <span className="text-lg font-mono font-bold text-pink-400">
                      {bridge.consensus_score}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Propaganda Callout */}
              <div>
                <h3 className="text-xl sm:text-2xl font-mono font-bold text-zinc-100 leading-snug">
                  {bridge.topic}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono text-zinc-400">
                  <span className="text-pink-400 font-semibold">Distortion Vector:</span>
                  <span>{bridge.detected_propaganda_tactic.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Perspective Toggles */}
              <div className="flex p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSide((prev) => ({ ...prev, [bridge.id]: 'SYNTHESIS' }))
                  }
                  className={`flex-1 min-h-[38px] py-1.5 px-2 rounded-lg transition-all ${
                    activeSide === 'SYNTHESIS'
                      ? 'bg-cyan-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Common Ground
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSide((prev) => ({ ...prev, [bridge.id]: 'A' }))}
                  className={`flex-1 min-h-[38px] py-1.5 px-2 rounded-lg transition-all ${
                    activeSide === 'A'
                      ? 'bg-zinc-800 text-cyan-400 font-bold border border-cyan-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Party A
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSide((prev) => ({ ...prev, [bridge.id]: 'B' }))}
                  className={`flex-1 min-h-[38px] py-1.5 px-2 rounded-lg transition-all ${
                    activeSide === 'B'
                      ? 'bg-zinc-800 text-pink-400 font-bold border border-pink-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Party B
                </button>
              </div>

              {/* Active Tab View Body */}
              {activeSide === 'SYNTHESIS' && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/20 to-pink-950/20 border border-cyan-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Heart className="w-3.5 h-3.5" />
                    Unified Human Truth
                  </div>
                  <p className="text-zinc-100 text-base font-sans leading-relaxed italic">
                    "{bridge.common_ground_statement}"
                  </p>
                  <div className="pt-2 border-t border-zinc-800/80 text-xs font-mono text-zinc-300">
                    <span className="text-pink-400 font-semibold mr-1.5">Action Protocol:</span>
                    {bridge.actionable_synthesis}
                  </div>
                </div>
              )}

              {activeSide === 'A' && (
                <div className="p-4 rounded-xl bg-cyan-950/15 border border-cyan-500/30 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center text-cyan-400 font-mono font-bold">
                    <span>{bridge.side_a.label}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">
                      Need: {bridge.side_a.underlying_human_need.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-zinc-200 text-sm">{bridge.side_a.stated_position}</p>
                  <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-400">
                    <span className="text-cyan-300 font-mono block font-semibold mb-0.5">Core Fear:</span>
                    {bridge.side_a.core_fear}
                  </div>
                  <p className="text-zinc-400 italic">{bridge.side_a.propaganda_distortion}</p>
                </div>
              )}

              {activeSide === 'B' && (
                <div className="p-4 rounded-xl bg-pink-950/15 border border-pink-500/30 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center text-pink-400 font-mono font-bold">
                    <span>{bridge.side_b.label}</span>
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/40">
                      Need: {bridge.side_b.underlying_human_need.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-zinc-200 text-sm">{bridge.side_b.stated_position}</p>
                  <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-400">
                    <span className="text-pink-300 font-mono block font-semibold mb-0.5">Core Fear:</span>
                    {bridge.side_b.core_fear}
                  </div>
                  <p className="text-zinc-400 italic">{bridge.side_b.propaganda_distortion}</p>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {bridge.shares_count || 0} shares worldwide
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteBridge(bridge.id)}
                    aria-label="Remove accord"
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenShare(bridge)}
                    leftIcon={<Share2 className="w-4 h-4" aria-hidden="true" />}
                  >
                    Share Truth
                  </Button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredBridges.length === 0 && (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-zinc-400 font-mono text-sm">No accords found matching your search.</p>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
