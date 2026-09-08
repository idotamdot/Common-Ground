import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';
import { TelemetryPacket } from '../../../types';
import { Button } from '../../ui/Button';

const BUFFER_CAPACITY = 60; // 60-second sliding ring buffer

export const MetricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringBufferRef = useRef<TelemetryPacket[]>([]);
  const isPlayingRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [scrubberPos, setScrubberPos] = useState<number>(BUFFER_CAPACITY);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);

  // Interactive parameters (Pattern E: vector state sliders)
  const [empathyMultiplier, setEmpathyMultiplier] = useState<number>(1.2);
  const [biasFilterThreshold, setBiasFilterThreshold] = useState<number>(75);

  const [currentMetric, setCurrentMetric] = useState<TelemetryPacket>({
    id: 'pkt_0',
    timestamp: Date.now(),
    empathyIndex: 82,
    biasFilterVelocity: 74,
    activeGlobalBridges: 14280,
    commonGroundConsensusRate: 91.4,
    region: 'North America / EU',
    headlineEvent: 'Food & Energy Grid Mutual Aid Treaty',
  });

  // Seed initial ring buffer
  useEffect(() => {
    const initialPackets: TelemetryPacket[] = [];
    const now = Date.now();
    for (let i = BUFFER_CAPACITY; i >= 0; i--) {
      initialPackets.push({
        id: `pkt_seed_${i}`,
        timestamp: now - i * 1000,
        empathyIndex: 75 + Math.sin(i * 0.3) * 12 + Math.random() * 5,
        biasFilterVelocity: 68 + Math.cos(i * 0.2) * 10 + Math.random() * 6,
        activeGlobalBridges: 14200 + (BUFFER_CAPACITY - i) * 2,
        commonGroundConsensusRate: 88 + Math.sin(i * 0.25) * 5,
        region: ['Asia Pacific', 'Latin America', 'Sub-Saharan Africa', 'Europe', 'North America'][i % 5],
        headlineEvent: 'Cross-Border Water Resource Harmony Accord',
      });
    }
    ringBufferRef.current = initialPackets;
  }, []);

  // Real-time generator simulating high-speed streaming telemetry (Pattern B)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return;

      const baseEmpathy = 78 + Math.sin(Date.now() / 3000) * 12;
      const calculatedEmpathy = Math.min(100, Math.max(10, baseEmpathy * empathyMultiplier));
      const calculatedBias = Math.min(100, Math.max(15, 60 + Math.cos(Date.now() / 2500) * 20));

      const newPacket: TelemetryPacket = {
        id: `pkt_${Date.now()}`,
        timestamp: Date.now(),
        empathyIndex: Math.round(calculatedEmpathy),
        biasFilterVelocity: Math.round(calculatedBias),
        activeGlobalBridges: ringBufferRef.current[ringBufferRef.current.length - 1]?.activeGlobalBridges + 1 || 14285,
        commonGroundConsensusRate: Number((85 + (calculatedEmpathy / 100) * 10).toFixed(1)),
        region: ['Global South Accord', 'Nordic Climate Union', 'Mekong River Coalition', 'Andean Solidarity Grid'][
          Math.floor(Math.random() * 4)
        ],
        headlineEvent: [
          'De-escalated misinformation regarding grain export shipping',
          'Citizen consensus reaches 92% on clean aquifer sharing',
          'Biometric passkey accord verified on cross-border logistics',
          'Propaganda scarcity narrative dismantled by mutual audit',
        ][Math.floor(Math.random() * 4)],
      };

      const buf = ringBufferRef.current;
      buf.push(newPacket);
      if (buf.length > BUFFER_CAPACITY) {
        buf.shift();
      }

      setCurrentMetric(newPacket);

      // Audio/haptic feedback trigger on threshold breach (Pattern B)
      if (calculatedEmpathy > biasFilterThreshold && hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [empathyMultiplier, biasFilterThreshold, hapticEnabled]);

  // RequestAnimationFrame 60fps canvas render loop
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear with deep obsidian background
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const packets = ringBufferRef.current;
    if (packets.length < 2) return;

    // Render Empathy Index Wave (Electric Cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    packets.forEach((p, index) => {
      const x = (index / (BUFFER_CAPACITY - 1)) * width;
      const y = height - (p.empathyIndex / 100) * (height - 60) - 30;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient under cyan line
    const cyanGrad = ctx.createLinearGradient(0, 0, 0, height);
    cyanGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    cyanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = cyanGrad;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Render Bias Filter Velocity Line (Magenta)
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    packets.forEach((p, index) => {
      const x = (index / (BUFFER_CAPACITY - 1)) * width;
      const y = height - (p.biasFilterVelocity / 100) * (height - 60) - 30;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw active scrubber cursor if paused
    if (!isPlayingRef.current) {
      const cursorX = (scrubberPos / BUFFER_CAPACITY) * width;
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, height);
      ctx.stroke();
    }
  }, [scrubberPos]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderFrame();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  const togglePlay = () => {
    const next = !isPlaying;
    isPlayingRef.current = next;
    setIsPlaying(next);
  };

  const handleScrub = (val: number) => {
    setScrubberPos(val);
    isPlayingRef.current = false;
    setIsPlaying(false);
    const targetIdx = Math.min(ringBufferRef.current.length - 1, Math.max(0, val));
    if (ringBufferRef.current[targetIdx]) {
      setCurrentMetric(ringBufferRef.current[targetIdx]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-100 flex items-center gap-2">
            <span>Global Consensus Radar</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time telemetry measuring worldwide propaganda neutralization and shared truth velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHapticEnabled(!hapticEnabled)}
            aria-label="Toggle haptic triggers"
            leftIcon={hapticEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          >
            Haptic {hapticEnabled ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={togglePlay}
            leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isPlaying ? 'Pause Stream' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Primary 60fps Metric Canvas */}
      <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Empathy Vector Index
            </span>
            <span className="flex items-center gap-1.5 text-pink-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
              Propaganda Defense Rate
            </span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">60fps RAF Render Buffer</span>
        </div>

        <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={320}
            className="w-full h-full object-cover block"
          />
        </div>

        {/* Live Scrubber & Playback */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">
            -60s Scrubber
          </span>
          <input
            type="range"
            min="0"
            max={BUFFER_CAPACITY}
            value={scrubberPos}
            onChange={(e) => handleScrub(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
            aria-label="Historical telemetry scrubber"
          />
          <span className="text-xs font-mono text-cyan-400 font-bold whitespace-nowrap">
            Live
          </span>
        </div>
      </div>

      {/* Real-Time Metric Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <span className="text-xs font-mono text-zinc-400 block">Empathy Index</span>
          <p className="text-2xl font-mono font-bold text-cyan-400 mt-1">
            {currentMetric.empathyIndex}
            <span className="text-xs text-zinc-500 ml-1">/100</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <span className="text-xs font-mono text-zinc-400 block">Consensus Rate</span>
          <p className="text-2xl font-mono font-bold text-pink-400 mt-1">
            {currentMetric.commonGroundConsensusRate}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <span className="text-xs font-mono text-zinc-400 block">Active Accords</span>
          <p className="text-2xl font-mono font-bold text-zinc-100 mt-1">
            {currentMetric.activeGlobalBridges.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <span className="text-xs font-mono text-zinc-400 block">Active Region</span>
          <p className="text-xs font-mono font-semibold text-emerald-400 mt-2 truncate">
            {currentMetric.region}
          </p>
        </div>
      </div>

      {/* Pattern E: Vector Parameter Sliders */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-mono font-semibold text-zinc-200">
          <Activity className="w-4 h-4 text-cyan-400" />
          Interactive Vector Physics Simulation
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Empathy Resonance Multiplier</span>
              <span className="text-cyan-400 font-bold">{empathyMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={empathyMultiplier}
              onChange={(e) => setEmpathyMultiplier(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Propaganda Filter Threshold</span>
              <span className="text-pink-400 font-bold">{biasFilterThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={biasFilterThreshold}
              onChange={(e) => setBiasFilterThreshold(Number(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Headline Stream Ticker */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-3 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 shrink-0 font-bold">
            FEED
          </span>
          <span className="text-zinc-300 truncate">{currentMetric.headlineEvent}</span>
        </div>
      </div>
    </div>
  );
};
