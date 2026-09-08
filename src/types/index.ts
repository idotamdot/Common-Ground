/**
 * Strict TypeScript Type Definitions for Common Ground Global
 * Fully compliant with Pattern A-F architectural standards
 */

export type EntityId = string;

export interface User {
  user_id: string;
  email: string;
  display_name: string;
  passkey_enabled: boolean;
  credential_id?: string;
  avatar_url?: string;
  reputation_score: number;
  bridges_built: number;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  wallet_id: string;
  user_id: string;
  balance_credits: number;
  staked_consensus: number;
  currency: string;
  updated_at: string;
}

export interface Transaction {
  transaction_id: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  type: 'BRIDGE_GRANT' | 'CONSENSUS_STAKE' | 'MEDIATION_ESCROW' | 'HARMONY_REWARD';
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  idempotency_key: string;
  payload_hash: string;
  created_at: string;
}

export interface Milestone {
  milestone_id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'PROPAGANDA_DEFEATED' | 'GLOBAL_BRIDGE' | 'LOCAL_ACCORD' | 'PERSPECTIVE_SHIFTER';
  achieved_at: string;
  verifiable_badge_url: string;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_digest?: string;
  details: Record<string, unknown>;
  timestamp: string;
}

/**
 * Common Ground & Misunderstanding Resolution Domain Entity
 */
export type PropagandaTactic =
  | 'US_VS_THEM'
  | 'SCARCITY_ILLUSION'
  | 'OUTGROUP_DEMONIZATION'
  | 'EMOTIONAL_CONTAGION'
  | 'FALSE_DILEMMA'
  | 'HISTORICAL_AMNESIA'
  | 'SELECTIVE_OUTRAGE';

export type UniversalHumanNeed =
  | 'SAFETY_PEACE'
  | 'HEALTH_CLEAN_WATER'
  | 'FAMILY_LOVE'
  | 'DIGNITY_RESPECT'
  | 'ECONOMIC_PROSPERITY'
  | 'TRUTH_HONESTY'
  | 'FUTURE_FOR_CHILDREN';

export interface PerspectiveSide {
  label: string;
  stated_position: string;
  underlying_human_need: UniversalHumanNeed;
  core_fear: string;
  propaganda_distortion: string;
}

export interface BridgeRecord {
  id: string;
  user_id: string;
  topic: string;
  category: 'GLOBAL_CONFLICT' | 'CULTURAL_DIVIDE' | 'ECONOMIC_SYSTEMS' | 'RESOURCE_SHARING' | 'NEIGHBORHOOD_ACCORD';
  side_a: PerspectiveSide;
  side_b: PerspectiveSide;
  detected_propaganda_tactic: PropagandaTactic;
  common_ground_statement: string;
  actionable_synthesis: string;
  consensus_score: number; // 0 to 100%
  verified_by_passkey: boolean;
  shares_count: number;
  status: 'OPTIMISTIC_LOCAL' | 'SYNCED' | 'DISPUTED';
  created_at: string;
  updated_at: string;
}

/**
 * Pattern C: Multi-Step FSM States
 */
export type MediationStep =
  | 'ISSUE_FRAMING'
  | 'PERSPECTIVES_CAPTURE'
  | 'PROPAGANDA_DECONSTRUCTION'
  | 'COMMON_GROUND_SYNTHESIS'
  | 'PASSKEY_SEAL_AND_SHARE';

export interface MediationFSMState {
  currentStep: MediationStep;
  completedSteps: MediationStep[];
  topic: string;
  category: BridgeRecord['category'];
  sideA: PerspectiveSide;
  sideB: PerspectiveSide;
  tactic: PropagandaTactic;
  synthesis: string;
  actionPlan: string;
  consensusScore: number;
  signedHash?: string;
  isSubmitting: boolean;
  error?: string;
}

/**
 * Pattern B: Real-Time Stream Telemetry
 */
export interface TelemetryPacket {
  id: string;
  timestamp: number;
  empathyIndex: number; // 0 - 100
  biasFilterVelocity: number; // 0 - 100
  activeGlobalBridges: number;
  commonGroundConsensusRate: number; // 0 - 100%
  region: string;
  headlineEvent: string;
}

/**
 * Offline Sync Queue Item
 */
export interface SyncQueueItem {
  id: string;
  type: 'CREATE_BRIDGE' | 'UPDATE_BRIDGE' | 'DELETE_BRIDGE' | 'SIGN_ACCORD';
  payload: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
  idempotencyKey: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'RESOLVED';
  error?: string;
}

/**
 * WebAuthn Passkey Types
 */
export interface PasskeyCredentialState {
  isAuthenticated: boolean;
  user: User | null;
  credentialId: string | null;
  method: 'BIOMETRIC_PASSKEY' | 'MAGIC_ASSERTION' | 'OFFLINE_GUEST';
}

/**
 * Social Share Card Configuration
 */
export interface ShareCardConfig {
  bridge: BridgeRecord;
  format: 'TWITTER_X' | 'INSTAGRAM_STORY' | 'WHATSAPP_STATUS' | 'LINKEDIN';
  badgeStyle: 'NEON_CYAN' | 'NEON_MAGENTA' | 'OBSIDIAN_GOLD';
}
