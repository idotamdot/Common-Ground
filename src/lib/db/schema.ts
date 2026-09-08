/**
 * Database Table Schemas & TypeScript Definitions
 * Aligns with PostgreSQL/Supabase Row-Level Security isolation.
 */

export interface DbUserTable {
  user_id: string; // UUID primary key
  email: string;
  display_name: string;
  passkey_enabled: boolean;
  credential_id: string | null;
  avatar_url: string | null;
  reputation_score: number;
  bridges_built: number;
  created_at: string;
  updated_at: string;
}

export interface DbWalletTable {
  wallet_id: string; // UUID primary key
  user_id: string; // foreign key -> users(user_id)
  balance_credits: number;
  staked_consensus: number;
  currency: string;
  updated_at: string;
}

export interface DbTransactionTable {
  transaction_id: string; // UUID primary key
  user_id: string; // foreign key -> users(user_id)
  wallet_id: string; // foreign key -> wallets(wallet_id)
  amount: number;
  type: 'BRIDGE_GRANT' | 'CONSENSUS_STAKE' | 'MEDIATION_ESCROW' | 'HARMONY_REWARD';
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  idempotency_key: string;
  payload_hash: string;
  created_at: string;
}

export interface DbMilestoneTable {
  milestone_id: string; // UUID primary key
  user_id: string; // foreign key -> users(user_id)
  title: string;
  description: string;
  category: string;
  achieved_at: string;
  verifiable_badge_url: string;
}

export interface DbAuditLogTable {
  log_id: string; // UUID primary key
  user_id: string; // foreign key -> users(user_id)
  action: string;
  resource_type: string;
  resource_id: string;
  ip_digest: string | null;
  details: string; // JSONB string
  timestamp: string;
}

export interface DbBridgeRecordTable {
  id: string; // UUID primary key
  user_id: string; // foreign key -> users(user_id)
  topic: string;
  category: string;
  side_a_json: string;
  side_b_json: string;
  detected_propaganda_tactic: string;
  common_ground_statement: string;
  actionable_synthesis: string;
  consensus_score: number;
  verified_by_passkey: boolean;
  shares_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * SQL DDL definition for schema initialization
 */
export const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  passkey_enabled BOOLEAN DEFAULT true,
  credential_id TEXT,
  avatar_url TEXT,
  reputation_score INTEGER DEFAULT 100,
  bridges_built INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallets (
  wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  balance_credits NUMERIC NOT NULL DEFAULT 100,
  staked_consensus NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'HARMONY_CREDITS',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.wallets(wallet_id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  idempotency_key TEXT UNIQUE NOT NULL,
  payload_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.milestones (
  milestone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  verifiable_badge_url TEXT
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  ip_digest TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bridges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  side_a_json JSONB NOT NULL,
  side_b_json JSONB NOT NULL,
  detected_propaganda_tactic TEXT NOT NULL,
  common_ground_statement TEXT NOT NULL,
  actionable_synthesis TEXT NOT NULL,
  consensus_score NUMERIC NOT NULL DEFAULT 85,
  verified_by_passkey BOOLEAN DEFAULT false,
  shares_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'OPTIMISTIC_LOCAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;
