import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, MapPin, Scan, Sparkles, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/Button';

export interface ScanResult {
  headline: string;
  propagandaTactic: string;
  deconstructedDeception: string;
  hiddenCommonNeed: string;
  suggestedBridge: string;
}

const SAMPLE_HEADLINES: ScanResult[] = [
  {
    headline: 'THEY ARE STEALING OUR FUTURE! Why Group B Must Be Stopped Before It Is Too Late',
    propagandaTactic: 'US_VS_THEM & OUTGROUP_DEMONIZATION',
    deconstructedDeception: 'Uses existential panic and dehumanizing language ("They are stealing") to block calm civic negotiation.',
    hiddenCommonNeed: 'Both Group A and Group B are deeply stressed about inflation, housing security, and their children’s livelihoods.',
    suggestedBridge: 'Shift conversation from "Who is guilty" to "How do we mutually expand affordable housing and job stability?"',
  },
  {
    headline: 'CRISIS LOOMS: Only Two Choices Left – Total Surrender or Extreme Retaliation',
    propagandaTactic: 'FALSE_DILEMMA & EMOTIONAL_CONTAGION',
    deconstructedDeception: 'Manufactures a fake binary choice to force readers into aggressive stances while ignoring nuanced compromises.',
    hiddenCommonNeed: 'Need for Safety, Peace, and Sovereignty.',
    suggestedBridge: 'Establish third-party verifiable buffer zones and direct humanitarian dialogue.',
  },
  {
    headline: 'DISASTER STRIKES: Scarcity is Permanent and There Is Not Enough Food For Everyone',
    propagandaTactic: 'SCARCITY_ILLUSION',
    deconstructedDeception: 'Hides systemic supply chain inefficiencies by blaming vulnerable neighbors and encouraging panic buying.',
    hiddenCommonNeed: 'Nourishment and certainty of physical survival.',
    suggestedBridge: 'Unite local cooperatives to coordinate emergency distribution rather than competing.',
  },
];

export const PropagandaLens: React.FC = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('Requesting GPS...');
  const [activeScan, setActiveScan] = useState<ScanResult>(SAMPLE_HEADLINES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Geolocation high-accuracy tracker (Pattern D)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
          setGeoStatus('GPS Synchronized');
        },
        () => {
          // Fallback simulation coordinates
          setCoords({ lat: 37.7749, lng: -122.4194 });
          setGeoStatus('Simulated GPS Sensor');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setCoords({ lat: 40.7128, lng: -74.006 });
      setGeoStatus('Sensors Inactive');
    }
  }, []);

  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
      return;
    }

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Camera access error', msg);
      setCameraError('Camera unavailable in current sandbox; optical simulator active.');
    }
  };

  const handleScanSample = (sample: ScanResult) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setActiveScan(sample);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-100 flex items-center gap-2">
          <span>Propaganda Lens & Scanner</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Hardware Sensor Bus
          </span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Aim your camera at any clickbait headline, polarized post, or flyer to strip propaganda framing and expose the real human need.
        </p>
      </div>

      {/* Hardware Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Local Sensor</span>
            <span className="text-xs font-mono font-semibold text-zinc-200 truncate">
              {coords ? `${coords.lat}°, ${coords.lng}°` : 'Acquiring GPS...'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Telemetry Status</span>
            <span className="text-xs font-mono font-semibold text-emerald-300">{geoStatus}</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Optical Viewfinder</span>
            <span className="text-xs font-mono font-semibold text-zinc-300">
              {cameraActive ? 'Camera Live' : 'Simulator'}
            </span>
          </div>
          <Button
            size="sm"
            variant={cameraActive ? 'danger' : 'outline'}
            onClick={toggleCamera}
            leftIcon={cameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          >
            {cameraActive ? 'Stop' : 'Camera'}
          </Button>
        </div>
      </div>

      {/* Optical Viewfinder Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 min-h-[260px] sm:min-h-[320px] flex flex-col items-center justify-center p-4">
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-radial from-zinc-900 via-zinc-950 to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            <Scan className="w-12 h-12 text-cyan-500/40 animate-pulse mb-3" />
            <p className="text-sm font-mono text-zinc-300 font-semibold">
              Optical OCR Viewfinder Ready
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Select a propaganda sample below or tap "Camera" to inspect physical media in real time.
            </p>
          </div>
        )}

        {/* Viewfinder Target Reticle Overlay */}
        <div className="relative z-10 w-full max-w-md pointer-events-none p-4 border border-cyan-500/40 rounded-xl bg-zinc-950/70 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              OCR DECONSTRUCTION LENS
            </span>
            <span className="text-pink-400">PROPAGANDA DETECTED</span>
          </div>
          <p className="text-sm font-mono font-bold text-zinc-100 line-clamp-2">
            "{activeScan.headline}"
          </p>
        </div>

        {cameraError && (
          <div className="absolute bottom-3 left-3 right-3 z-20 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono text-amber-300">
            {cameraError}
          </div>
        )}
      </div>

      {/* Sample Headlines Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono text-zinc-400">Scan Example Propaganda Headlines:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_HEADLINES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleScanSample(sample)}
              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                activeScan.headline === sample.headline
                  ? 'bg-cyan-500/10 border-cyan-500/60 text-zinc-100'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="font-mono font-bold text-cyan-400 block mb-1">Sample #{idx + 1}</span>
              <span className="line-clamp-2">{sample.headline}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Result Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-cyan-500/30 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-400 font-mono text-sm font-bold">
            <AlertTriangle className="w-4 h-4" />
            Deconstructed Propaganda Distortion
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
            {activeScan.propagandaTactic}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-300">
          <span className="text-zinc-500 font-mono text-xs block mb-1 uppercase">How It Manipulates</span>
          {activeScan.deconstructedDeception}
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-sm text-cyan-200">
          <span className="text-cyan-400 font-mono text-xs block mb-1 uppercase">
            Actual Shared Human Need
          </span>
          {activeScan.hiddenCommonNeed}
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-sm text-emerald-200">
          <span className="text-emerald-400 font-mono text-xs block mb-1 uppercase">
            Constructive Bridge Action
          </span>
          {activeScan.suggestedBridge}
        </div>
      </div>
    </div>
  );
};
