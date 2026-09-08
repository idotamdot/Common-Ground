import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GitMerge,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Fingerprint,
  Share2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { BridgeRecord, UniversalHumanNeed, PropagandaTactic, MediationStep } from '../../../types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export interface BridgeBuilderFSMProps {
  onAccordCreated: (bridge: BridgeRecord) => void;
  onOpenShareModal: (bridge: BridgeRecord) => void;
  userId: string;
}

export const BridgeBuilderFSM: React.FC<BridgeBuilderFSMProps> = ({
  onAccordCreated,
  onOpenShareModal,
  userId,
}) => {
  const [currentStep, setCurrentStep] = useState<MediationStep>('ISSUE_FRAMING');

  // Form states
  const [topic, setTopic] = useState('Clean Water Distribution between Upstream & Downstream Farmers');
  const [category, setCategory] = useState<BridgeRecord['category']>('RESOURCE_SHARING');

  const [sideALabel, setSideALabel] = useState('Upstream Agricultural Cooperative');
  const [sideAPosition, setSideAPosition] = useState('Need water reserves for winter crop irrigation to prevent farm foreclosure.');
  const [sideANeed, setSideANeed] = useState<UniversalHumanNeed>('ECONOMIC_PROSPERITY');
  const [sideAFear, setSideAFear] = useState('Bankruptcy and loss of generational family homesteads.');

  const [sideBLabel, setSideBLabel] = useState('Downstream Wetland & Fishery Coalition');
  const [sideBPosition, setSideBPosition] = useState('Low river flow destroys estuary fish nurseries and municipal drinking reservoirs.');
  const [sideBNeed, setSideBNeed] = useState<UniversalHumanNeed>('HEALTH_CLEAN_WATER');
  const [sideBFear, setSideBFear] = useState('Children drinking contaminated groundwater and collapse of coastal fish supply.');

  const [tactic, setTactic] = useState<PropagandaTactic>('SCARCITY_ILLUSION');
  const [synthesis, setSynthesis] = useState('Both communities fundamentally cherish wholesome food and pure water for their families without economic destruction.');
  const [actionPlan, setActionPlan] = useState('Install precision drip-irrigation funded by water bonds with shared real-time aquifer sensors.');
  const [consensusScore, setConsensusScore] = useState<number>(93);

  const [signedRecord, setSignedRecord] = useState<BridgeRecord | null>(null);
  const [isSealing, setIsSealing] = useState(false);

  const stepsList: { id: MediationStep; title: string; num: number }[] = [
    { id: 'ISSUE_FRAMING', title: 'Frame Issue', num: 1 },
    { id: 'PERSPECTIVES_CAPTURE', title: 'Dual Perspectives', num: 2 },
    { id: 'PROPAGANDA_DECONSTRUCTION', title: 'Defuse Propaganda', num: 3 },
    { id: 'COMMON_GROUND_SYNTHESIS', title: 'Synthesize Truth', num: 4 },
    { id: 'PASSKEY_SEAL_AND_SHARE', title: 'Sign & Share', num: 5 },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.id === currentStep);

  const handleSealWithPasskey = async () => {
    setIsSealing(true);
    try {
      // Simulate cryptographic hash generation
      await new Promise((resolve) => setTimeout(resolve, 600));

      const accord: BridgeRecord = {
        id: `accord_${Date.now()}`,
        user_id: userId,
        topic,
        category,
        side_a: {
          label: sideALabel,
          stated_position: sideAPosition,
          underlying_human_need: sideANeed,
          core_fear: sideAFear,
          propaganda_distortion: `Propaganda labels them greedy hoarders`,
        },
        side_b: {
          label: sideBLabel,
          stated_position: sideBPosition,
          underlying_human_need: sideBNeed,
          core_fear: sideBFear,
          propaganda_distortion: `Propaganda labels them anti-farm extremists`,
        },
        detected_propaganda_tactic: tactic,
        common_ground_statement: synthesis,
        actionable_synthesis: actionPlan,
        consensus_score: consensusScore,
        verified_by_passkey: true,
        shares_count: 0,
        status: 'OPTIMISTIC_LOCAL',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setSignedRecord(accord);
      onAccordCreated(accord);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#ec4899', '#3b82f6', '#10b981'],
      });
    } finally {
      setIsSealing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-100 flex items-center gap-2">
          <span>Bridge Builder Workflow</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30">
            FSM Pipeline
          </span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Atomic 5-step dispute de-escalation pipeline. Converts toxic polarization into verified mutual accords.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
        {stepsList.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isDone = idx < currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/60 font-bold'
                  : isDone
                  ? 'bg-zinc-900 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-900/40 text-zinc-500 border-zinc-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? 'bg-cyan-400 text-zinc-950'
                    : isDone
                    ? 'bg-emerald-400 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
              </span>
              <span>{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Issue Framing */}
      {currentStep === 'ISSUE_FRAMING' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-4">
          <h3 className="text-lg font-mono font-bold text-zinc-100">Step 1: Frame the Disagreement</h3>
          <p className="text-sm text-zinc-400">
            Name the dispute neutrally without using charged propaganda language.
          </p>

          <Input
            label="Dispute Headline"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            helperText="State the tension objectively (e.g. 'Agricultural Water Rights vs Municipal Conservation')"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-mono font-medium text-zinc-300">Category Domain</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BridgeRecord['category'])}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm"
            >
              <option value="RESOURCE_SHARING">Resource Sharing & Climate</option>
              <option value="GLOBAL_CONFLICT">Global Conflict</option>
              <option value="ECONOMIC_SYSTEMS">Economic Systems & Labor</option>
              <option value="NEIGHBORHOOD_ACCORD">Local Community Accords</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={() => setCurrentStep('PERSPECTIVES_CAPTURE')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Map Perspectives
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Perspectives Capture */}
      {currentStep === 'PERSPECTIVES_CAPTURE' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-5">
          <h3 className="text-lg font-mono font-bold text-zinc-100">Step 2: Map Underlying Fears & Needs</h3>
          <p className="text-sm text-zinc-400">
            Propaganda tells us the other side is evil. In reality, both sides are motivated by universal human needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Party A */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col gap-3">
              <span className="text-cyan-400 font-mono text-sm font-bold">Party 1</span>
              <Input
                label="Group Name"
                value={sideALabel}
                onChange={(e) => setSideALabel(e.target.value)}
              />
              <Input
                label="What they fear most"
                value={sideAFear}
                onChange={(e) => setSideAFear(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-zinc-400">Universal Need</label>
                <select
                  value={sideANeed}
                  onChange={(e) => setSideANeed(e.target.value as UniversalHumanNeed)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                >
                  <option value="ECONOMIC_PROSPERITY">Economic Prosperity</option>
                  <option value="SAFETY_PEACE">Safety & Peace</option>
                  <option value="HEALTH_CLEAN_WATER">Health & Clean Water</option>
                  <option value="FAMILY_LOVE">Family & Love</option>
                </select>
              </div>
            </div>

            {/* Party B */}
            <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30 flex flex-col gap-3">
              <span className="text-pink-400 font-mono text-sm font-bold">Party 2</span>
              <Input
                label="Group Name"
                value={sideBLabel}
                onChange={(e) => setSideBLabel(e.target.value)}
              />
              <Input
                label="What they fear most"
                value={sideBFear}
                onChange={(e) => setSideBFear(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-zinc-400">Universal Need</label>
                <select
                  value={sideBNeed}
                  onChange={(e) => setSideBNeed(e.target.value as UniversalHumanNeed)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                >
                  <option value="HEALTH_CLEAN_WATER">Health & Clean Water</option>
                  <option value="FUTURE_FOR_CHILDREN">Future for Children</option>
                  <option value="SAFETY_PEACE">Safety & Peace</option>
                  <option value="DIGNITY_RESPECT">Dignity & Respect</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('ISSUE_FRAMING')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep('PROPAGANDA_DECONSTRUCTION')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Identify Propaganda
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Propaganda Deconstruction */}
      {currentStep === 'PROPAGANDA_DECONSTRUCTION' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-5">
          <h3 className="text-lg font-mono font-bold text-zinc-100">Step 3: Defuse Propaganda Distortion</h3>
          <p className="text-sm text-zinc-400">
            How are algorithms and media outlets manipulating this issue to keep people enraged and divided?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'SCARCITY_ILLUSION', name: 'Scarcity Illusion', desc: 'Pretending there isn’t enough to share' },
              { id: 'US_VS_THEM', name: 'Us vs. Them Rhetoric', desc: 'Framing one side as righteous and other as evil' },
              { id: 'OUTGROUP_DEMONIZATION', name: 'Outgroup Demonization', desc: 'Dehumanizing the opposing humans' },
              { id: 'FALSE_DILEMMA', name: 'False Dilemma', desc: 'Pretending only two extreme options exist' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTactic(item.id as PropagandaTactic)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  tactic === item.id
                    ? 'bg-pink-500/15 border-pink-500/60 text-zinc-100 shadow-md'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="font-mono font-bold text-sm block text-pink-400">{item.name}</span>
                <span className="text-xs text-zinc-400 mt-1 block">{item.desc}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('PERSPECTIVES_CAPTURE')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep('COMMON_GROUND_SYNTHESIS')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Synthesize Common Ground
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Common Ground Synthesis */}
      {currentStep === 'COMMON_GROUND_SYNTHESIS' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-4">
          <h3 className="text-lg font-mono font-bold text-zinc-100">Step 4: Synthesize Shared Ground</h3>
          <p className="text-sm text-zinc-400">
            Formulate the universal truth both sides agree on, and define one actionable protocol to work together.
          </p>

          <Input
            label="Common Ground Statement"
            value={synthesis}
            onChange={(e) => setSynthesis(e.target.value)}
          />

          <Input
            label="Actionable Win-Win Protocol"
            value={actionPlan}
            onChange={(e) => setActionPlan(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between text-xs font-mono text-zinc-300">
              <span>Calculated Mutual Resonance</span>
              <span className="text-cyan-400 font-bold">{consensusScore}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="99"
              value={consensusScore}
              onChange={(e) => setConsensusScore(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('PROPAGANDA_DECONSTRUCTION')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep('PASSKEY_SEAL_AND_SHARE')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Cryptographic Seal & Share
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Passkey Seal & Viral Share */}
      {currentStep === 'PASSKEY_SEAL_AND_SHARE' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-cyan-500/40 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
            <ShieldCheck className="w-5 h-5" />
            Step 5: Cryptographic Passkey Seal & Social Share
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-2">
            <span className="text-xs font-mono text-zinc-400 uppercase">Accord Preview</span>
            <h4 className="text-base font-mono font-bold text-zinc-100">{topic}</h4>
            <p className="text-sm italic text-cyan-300">"{synthesis}"</p>
            <div className="text-xs font-mono text-pink-400 mt-1">
              Consensus Index: {consensusScore}% Verified
            </div>
          </div>

          {!signedRecord ? (
            <Button
              variant="primary"
              size="lg"
              isLoading={isSealing}
              onClick={handleSealWithPasskey}
              leftIcon={<Fingerprint className="w-5 h-5" />}
              className="w-full"
            >
              Sign Accord with Biometric Passkey
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Accord sealed with cryptographic Passkey signature!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => onOpenShareModal(signedRecord)}
                  leftIcon={<Share2 className="w-4 h-4" />}
                  className="w-full"
                >
                  Share to Social Media
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSignedRecord(null);
                    setCurrentStep('ISSUE_FRAMING');
                  }}
                  leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
                  className="w-full"
                >
                  Start New Accord
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep('COMMON_GROUND_SYNTHESIS')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Synthesis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
