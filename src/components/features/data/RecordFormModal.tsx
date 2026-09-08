import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, HeartHandshake } from 'lucide-react';
import { BridgeRecord, UniversalHumanNeed, PropagandaTactic } from '../../../types';
import { CreateBridgeFormSchema } from '../../../lib/validation/schemas';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBridge: (bridge: BridgeRecord) => void;
  userId: string;
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitBridge,
  userId,
}) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<BridgeRecord['category']>('GLOBAL_CONFLICT');
  const [sideALabel, setSideALabel] = useState('');
  const [sideAPosition, setSideAPosition] = useState('');
  const [sideANeed, setSideANeed] = useState<UniversalHumanNeed>('SAFETY_PEACE');
  const [sideAFear, setSideAFear] = useState('');

  const [sideBLabel, setSideBLabel] = useState('');
  const [sideBPosition, setSideBPosition] = useState('');
  const [sideBNeed, setSideBNeed] = useState<UniversalHumanNeed>('DIGNITY_RESPECT');
  const [sideBFear, setSideBFear] = useState('');

  const [propagandaTactic, setPropagandaTactic] = useState<PropagandaTactic>('US_VS_THEM');
  const [commonGround, setCommonGround] = useState('');
  const [actionableSynthesis, setActionableSynthesis] = useState('');
  const [consensusScore, setConsensusScore] = useState(88);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      topic: topic.trim(),
      category,
      side_a_label: sideALabel.trim(),
      side_a_position: sideAPosition.trim(),
      side_a_need: sideANeed,
      side_a_fear: sideAFear.trim(),
      side_b_label: sideBLabel.trim(),
      side_b_position: sideBPosition.trim(),
      side_b_need: sideBNeed,
      side_b_fear: sideBFear.trim(),
      detected_propaganda_tactic: propagandaTactic,
      common_ground_statement: commonGround.trim(),
      actionable_synthesis: actionableSynthesis.trim(),
      consensus_score: Number(consensusScore),
    };

    const validation = CreateBridgeFormSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    const newBridge: BridgeRecord = {
      id: `bridge_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      topic: formData.topic,
      category: formData.category,
      side_a: {
        label: formData.side_a_label,
        stated_position: formData.side_a_position,
        underlying_human_need: formData.side_a_need,
        core_fear: formData.side_a_fear,
        propaganda_distortion: `Sensational framing amplifies ${formData.side_a_fear.toLowerCase()}`,
      },
      side_b: {
        label: formData.side_b_label,
        stated_position: formData.side_b_position,
        underlying_human_need: formData.side_b_need,
        core_fear: formData.side_b_fear,
        propaganda_distortion: `Sensational framing amplifies ${formData.side_b_fear.toLowerCase()}`,
      },
      detected_propaganda_tactic: formData.detected_propaganda_tactic,
      common_ground_statement: formData.common_ground_statement,
      actionable_synthesis: formData.actionable_synthesis,
      consensus_score: formData.consensus_score,
      verified_by_passkey: true,
      shares_count: 0,
      status: 'OPTIMISTIC_LOCAL',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onSubmitBridge(newBridge);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Common Ground Accord"
      description="Deconstruct polarized rhetoric by discovering the shared human desires on both sides."
      id="record-form-modal"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Input
            label="Issue or Misunderstanding Topic"
            required
            placeholder="e.g. Urban Density & Affordable Housing vs Historic Neighborhood Preservation"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            error={errors.topic}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-mono font-medium text-zinc-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BridgeRecord['category'])}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="GLOBAL_CONFLICT">Global Conflict</option>
              <option value="CULTURAL_DIVIDE">Cultural Divide</option>
              <option value="ECONOMIC_SYSTEMS">Economic Systems</option>
              <option value="RESOURCE_SHARING">Resource Sharing</option>
              <option value="NEIGHBORHOOD_ACCORD">Neighborhood Accord</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-mono font-medium text-zinc-300">
              Detected Propaganda Distortion
            </label>
            <select
              value={propagandaTactic}
              onChange={(e) => setPropagandaTactic(e.target.value as PropagandaTactic)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="US_VS_THEM">Us vs. Them Rhetoric</option>
              <option value="SCARCITY_ILLUSION">Scarcity Illusion</option>
              <option value="OUTGROUP_DEMONIZATION">Outgroup Demonization</option>
              <option value="EMOTIONAL_CONTAGION">Emotional Contagion</option>
              <option value="FALSE_DILEMMA">False Dilemma</option>
              <option value="HISTORICAL_AMNESIA">Historical Amnesia</option>
              <option value="SELECTIVE_OUTRAGE">Selective Outrage</option>
            </select>
          </div>
        </div>

        {/* Side A details */}
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            Party A Perspective
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Party A Label"
              required
              placeholder="e.g. Younger Renters & Essential Workers"
              value={sideALabel}
              onChange={(e) => setSideALabel(e.target.value)}
              error={errors.side_a_label}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-mono font-medium text-zinc-300">Universal Need</label>
              <select
                value={sideANeed}
                onChange={(e) => setSideANeed(e.target.value as UniversalHumanNeed)}
                className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm"
              >
                <option value="ECONOMIC_PROSPERITY">Economic Prosperity & Shelter</option>
                <option value="DIGNITY_RESPECT">Dignity & Respect</option>
                <option value="FUTURE_FOR_CHILDREN">Future for Children</option>
                <option value="SAFETY_PEACE">Safety & Peace</option>
              </select>
            </div>
          </div>
          <Input
            label="What is their primary stated position?"
            required
            placeholder="e.g. Rent costs consume 60% of income; missing housing supply forces displacement."
            value={sideAPosition}
            onChange={(e) => setSideAPosition(e.target.value)}
            error={errors.side_a_position}
          />
          <Input
            label="What is their deepest underlying fear?"
            required
            placeholder="e.g. Permanent homelessness or having to abandon their city."
            value={sideAFear}
            onChange={(e) => setSideAFear(e.target.value)}
            error={errors.side_a_fear}
          />
        </div>

        {/* Side B details */}
        <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-400 font-mono text-sm font-semibold">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            Party B Perspective
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Party B Label"
              required
              placeholder="e.g. Long-time Homeowners & Elders"
              value={sideBLabel}
              onChange={(e) => setSideBLabel(e.target.value)}
              error={errors.side_b_label}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-mono font-medium text-zinc-300">Universal Need</label>
              <select
                value={sideBNeed}
                onChange={(e) => setSideBNeed(e.target.value as UniversalHumanNeed)}
                className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm"
              >
                <option value="SAFETY_PEACE">Safety & Community Stability</option>
                <option value="DIGNITY_RESPECT">Dignity & Life Savings</option>
                <option value="FAMILY_LOVE">Family & Heritage</option>
              </select>
            </div>
          </div>
          <Input
            label="What is their primary stated position?"
            required
            placeholder="e.g. Megablocks destroy neighborhood trees, street parking, and architectural heritage."
            value={sideBPosition}
            onChange={(e) => setSideBPosition(e.target.value)}
            error={errors.side_b_position}
          />
          <Input
            label="What is their deepest underlying fear?"
            required
            placeholder="e.g. Life savings in their home erased, neighborhood character destroyed by absentee corporate developers."
            value={sideBFear}
            onChange={(e) => setSideBFear(e.target.value)}
            error={errors.side_b_fear}
          />
        </div>

        {/* Synthesis & Common Ground */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-semibold">
            <HeartHandshake className="w-4 h-4" aria-hidden="true" />
            The Common Ground Synthesis
          </div>
          <Input
            label="What fundamental truth and shared desire unites both sides?"
            required
            placeholder="e.g. Both desire vibrant, secure neighborhoods where families can flourish across generations without displacement."
            value={commonGround}
            onChange={(e) => setCommonGround(e.target.value)}
            error={errors.common_ground_statement}
          />
          <Input
            label="Actionable Win-Win Step"
            required
            placeholder="e.g. Green community land trusts and gentle mid-rise density with protected tree canopies."
            value={actionableSynthesis}
            onChange={(e) => setActionableSynthesis(e.target.value)}
            error={errors.actionable_synthesis}
          />

          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Calculated Consensus Score</span>
              <span className="text-cyan-400 font-bold">{consensusScore}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="99"
              value={consensusScore}
              onChange={(e) => setConsensusScore(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" aria-hidden="true" />}
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
          >
            Seal & Publish Accord
          </Button>
        </div>
      </form>
    </Modal>
  );
};
