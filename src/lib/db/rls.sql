-- Explicit Row-Level Security (RLS) Policies for Common Ground Global
-- Deterministic User Data Isolation

-- RLS Policy for table: users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_user_isolation_select" ON public.users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_user_isolation_insert" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_user_isolation_update" ON public.users
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_user_isolation_delete" ON public.users
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policy for table: wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallets_user_isolation_select" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wallets_user_isolation_insert" ON public.wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wallets_user_isolation_update" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wallets_user_isolation_delete" ON public.wallets
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policy for table: transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_user_isolation_select" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_user_isolation_insert" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_user_isolation_update" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_user_isolation_delete" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policy for table: milestones
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "milestones_user_isolation_select" ON public.milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "milestones_user_isolation_insert" ON public.milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "milestones_user_isolation_update" ON public.milestones
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "milestones_user_isolation_delete" ON public.milestones
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policy for table: audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_user_isolation_select" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "audit_logs_user_isolation_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "audit_logs_user_isolation_update" ON public.audit_logs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "audit_logs_user_isolation_delete" ON public.audit_logs
  FOR DELETE USING (auth.uid() = user_id);
