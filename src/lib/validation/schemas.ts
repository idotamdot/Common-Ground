import { z } from 'zod';

/**
 * Section 5.2 Mandatory Runtime Environment Schema
 */
export const envSchema = z.object({
  APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').default('postgresql://postgres:postgres@localhost:5432/commonground'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 chars').default('cg_session_secret_ultra_secure_passkey_2026_x99')
});

/**
 * Universal Human Need Enum Schema
 */
export const UniversalHumanNeedSchema = z.enum([
  'SAFETY_PEACE',
  'HEALTH_CLEAN_WATER',
  'FAMILY_LOVE',
  'DIGNITY_RESPECT',
  'ECONOMIC_PROSPERITY',
  'TRUTH_HONESTY',
  'FUTURE_FOR_CHILDREN'
]);

/**
 * Propaganda Tactics Enum Schema
 */
export const PropagandaTacticSchema = z.enum([
  'US_VS_THEM',
  'SCARCITY_ILLUSION',
  'OUTGROUP_DEMONIZATION',
  'EMOTIONAL_CONTAGION',
  'FALSE_DILEMMA',
  'HISTORICAL_AMNESIA',
  'SELECTIVE_OUTRAGE'
]);

export const PerspectiveSideSchema = z.object({
  label: z.string().min(2, 'Party label must be at least 2 characters').max(50),
  stated_position: z.string().min(5, 'Stated position must be at least 5 characters').max(300),
  underlying_human_need: UniversalHumanNeedSchema,
  core_fear: z.string().min(5, 'Core fear must be stated clearly to build empathy').max(300),
  propaganda_distortion: z.string().min(5, 'Describe how media/propaganda exaggerates this').max(300),
}).strict();

export const BridgeRecordSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  topic: z.string().min(5, 'Topic title must be at least 5 characters').max(120),
  category: z.enum([
    'GLOBAL_CONFLICT',
    'CULTURAL_DIVIDE',
    'ECONOMIC_SYSTEMS',
    'RESOURCE_SHARING',
    'NEIGHBORHOOD_ACCORD'
  ]),
  side_a: PerspectiveSideSchema,
  side_b: PerspectiveSideSchema,
  detected_propaganda_tactic: PropagandaTacticSchema,
  common_ground_statement: z.string().min(10, 'Common ground synthesis must be meaningful and clear').max(500),
  actionable_synthesis: z.string().min(10, 'Action plan must be clear and actionable').max(500),
  consensus_score: z.number().min(0).max(100),
  verified_by_passkey: z.boolean().default(false),
  shares_count: z.number().int().nonnegative().default(0),
  status: z.enum(['OPTIMISTIC_LOCAL', 'SYNCED', 'DISPUTED']).default('OPTIMISTIC_LOCAL'),
  created_at: z.string(),
  updated_at: z.string()
}).strict();

export const CreateBridgeFormSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters (e.g., "Water Rights on River Delta")').max(120),
  category: z.enum([
    'GLOBAL_CONFLICT',
    'CULTURAL_DIVIDE',
    'ECONOMIC_SYSTEMS',
    'RESOURCE_SHARING',
    'NEIGHBORHOOD_ACCORD'
  ]),
  side_a_label: z.string().min(2, 'Party A Name/Group is required'),
  side_a_position: z.string().min(5, 'Describe Party A position'),
  side_a_need: UniversalHumanNeedSchema,
  side_a_fear: z.string().min(5, 'Party A deepest underlying fear'),
  side_b_label: z.string().min(2, 'Party B Name/Group is required'),
  side_b_position: z.string().min(5, 'Describe Party B position'),
  side_b_need: UniversalHumanNeedSchema,
  side_b_fear: z.string().min(5, 'Party B deepest underlying fear'),
  detected_propaganda_tactic: PropagandaTacticSchema,
  common_ground_statement: z.string().min(10, 'Synthesize the truth both parties actually share'),
  actionable_synthesis: z.string().min(10, 'One immediate step they can collaborate on'),
  consensus_score: z.number().min(20).max(100).default(85)
}).strict();

export type CreateBridgeFormData = z.infer<typeof CreateBridgeFormSchema>;

export const PasskeyRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(40),
  deviceNickname: z.string().min(2).max(50).default('Personal Smartphone')
}).strict();

export const UserSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().min(2),
  passkey_enabled: z.boolean(),
  credential_id: z.string().optional(),
  avatar_url: z.string().url().optional(),
  reputation_score: z.number().int().nonnegative(),
  bridges_built: z.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string()
});

export const WalletSchema = z.object({
  wallet_id: z.string().uuid(),
  user_id: z.string().uuid(),
  balance_credits: z.number().nonnegative(),
  staked_consensus: z.number().nonnegative(),
  currency: z.string().default('HARMONY_CREDITS'),
  updated_at: z.string()
});

export const TransactionSchema = z.object({
  transaction_id: z.string().uuid(),
  user_id: z.string().uuid(),
  wallet_id: z.string().uuid(),
  amount: z.number().positive(),
  type: z.enum(['BRIDGE_GRANT', 'CONSENSUS_STAKE', 'MEDIATION_ESCROW', 'HARMONY_REWARD']),
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED']),
  idempotency_key: z.string().min(16),
  payload_hash: z.string().min(32),
  created_at: z.string()
});
