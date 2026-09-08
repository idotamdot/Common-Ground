import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Download, Copy, Check, Sparkles, MessageCircle, Twitter, Instagram } from 'lucide-react';
import { BridgeRecord } from '../../../types';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridge: BridgeRecord | null;
  onShareCompleted?: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  bridge,
  onShareCompleted,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  if (!bridge) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#ec4899', '#f8fafc', '#10b981'],
    });
  };

  const shareText = `🕊️ "${bridge.topic}": ${bridge.consensus_score}% Common Ground found!\n\nBoth sides want: ${bridge.common_ground_statement}\n\nStop falling for propaganda. Work with, not against.\n#CommonGround #BridgeTheDivide`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://commonground.world';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      triggerConfetti();
      onShareCompleted?.();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Common Ground: ${bridge.topic}`,
          text: shareText,
          url: shareUrl,
        });
        triggerConfetti();
        onShareCompleted?.();
      } catch (err) {
        // User cancelled or share failed
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCardImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, 1200, 630);

      // Subtle cyan & magenta glow circles
      const gradient = ctx.createRadialGradient(200, 100, 10, 200, 100, 400);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      gradient.addColorStop(1, 'rgba(9, 10, 15, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Card boundary
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 1120, 550);

      // Header Tag
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('COMMON GROUND GLOBAL • VERIFIED ACCORD', 80, 100);

      // Consensus Score Pill
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(`${bridge.consensus_score}% SHARED TRUTH`, 780, 100);

      // Topic Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 44px sans-serif';
      const words = bridge.topic.split(' ');
      let line = '';
      let y = 170;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 1000 && n > 0) {
          ctx.fillText(line, 80, y);
          line = words[n] + ' ';
          y += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 80, y);

      // Perspective A & B Needs
      y += 50;
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '24px sans-serif';
      ctx.fillText(`Side A: ${bridge.side_a.label} (${bridge.side_a.underlying_human_need})`, 80, y);
      y += 35;
      ctx.fillText(`Side B: ${bridge.side_b.label} (${bridge.side_b.underlying_human_need})`, 80, y);

      // Common Ground Quote Box
      y += 45;
      ctx.fillStyle = '#18181b';
      ctx.fillRect(80, y, 1040, 130);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, y, 1040, 130);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 28px sans-serif';
      ctx.fillText(`"${bridge.common_ground_statement}"`, 110, y + 60);

      // Footer
      ctx.fillStyle = '#71717a';
      ctx.font = '20px monospace';
      ctx.fillText('Dismantle propaganda • Work with, not against • commonground.world', 80, 550);

      // Convert to downloadable file
      const link = document.createElement('a');
      link.download = `common-ground-${bridge.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      triggerConfetti();
      onShareCompleted?.();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Shared Truth"
      description="Help this bridge go viral. When people realize we all want the same fundamentals, propaganda dissolves."
      id="share-card-modal"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5">
        {/* Renderable Preview Card with Obsidian Neon Styling */}
        <div
          ref={cardPreviewRef}
          className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-cyan-500/40 shadow-2xl relative overflow-hidden flex flex-col gap-4"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />

          {/* Badge & Metric */}
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Common Ground Accord
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30">
              {bridge.consensus_score}% Shared Ground
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-mono font-bold text-zinc-100 leading-snug">
              {bridge.topic}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Overcoming: <span className="text-amber-400">{bridge.detected_propaganda_tactic.replace(/_/g, ' ')}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-200 text-sm italic relative">
            <span className="text-cyan-400 font-bold not-italic mr-1">"</span>
            {bridge.common_ground_statement}
            <span className="text-cyan-400 font-bold not-italic ml-1">"</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Party 1</span>
              <span className="text-zinc-300 font-medium truncate block">{bridge.side_a.label}</span>
              <span className="text-cyan-400 text-[11px] block mt-0.5">Need: {bridge.side_a.underlying_human_need.replace(/_/g, ' ')}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Party 2</span>
              <span className="text-zinc-300 font-medium truncate block">{bridge.side_b.label}</span>
              <span className="text-pink-400 text-[11px] block mt-0.5">Need: {bridge.side_b.underlying_human_need.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
            <span>Passkey Signed • Verifiable Accord</span>
            <span>commonground.world</span>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              variant="primary"
              onClick={handleNativeShare}
              leftIcon={<Share2 className="w-4 h-4" aria-hidden="true" />}
              className="w-full"
            >
              Share to Apps / Friends
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadCardImage}
              isLoading={isGenerating}
              leftIcon={<Download className="w-4 h-4 text-cyan-400" aria-hidden="true" />}
              className="w-full"
            >
              Download Graphic Card
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              className="flex-1"
            >
              {copied ? 'Copied with Quotes!' : 'Copy Formatted Text'}
            </Button>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X / Twitter"
              className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            >
              <Twitter className="w-4 h-4" aria-hidden="true" />
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
