import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, Sparkles, CheckCircle2, AlertTriangle, LogOut, KeyRound } from 'lucide-react';
import { User } from '../../../types';
import {
  registerPasskey,
  authenticatePasskey,
  clearCurrentSession,
  isPasskeySupported,
} from '../../../lib/auth/webauthn';
import { PasskeyRegistrationSchema } from '../../../lib/validation/schemas';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export interface PasskeyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export const PasskeyAuthModal: React.FC<PasskeyAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [hasWebAuthnSupport, setHasWebAuthnSupport] = useState<boolean>(true);

  useEffect(() => {
    isPasskeySupported().then(setHasWebAuthnSupport);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const validation = PasskeyRegistrationSchema.safeParse({
      email: email.trim(),
      displayName: displayName.trim(),
      deviceNickname: 'Smartphone / Device',
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid registration data');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerPasskey(email.trim(), displayName.trim());
      if (res.success && res.user) {
        onUserChange(res.user);
        setSuccessMsg(
          res.isMockFallback
            ? 'Cryptographic passkey generated & secured locally.'
            : 'Biometric passkey successfully bound to this device!'
        );
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Failed to complete passkey registration ceremony');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown registration error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await authenticatePasskey(email.trim() || undefined);
      if (res.success && res.user) {
        onUserChange(res.user);
        setSuccessMsg('Passkey asserted! Verified identity unlocked.');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(res.error || 'Passkey assertion failed. Please register if this is your first time.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Passkey error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearCurrentSession();
    onUserChange(null);
    setSuccessMsg('Session cleared.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser ? 'Passkey Verified Identity' : 'Zero-Password Biometric Auth'}
      description="Secured by FIDO2 WebAuthn passkey tokens. No passwords, no surveillance, pure privacy."
      id="passkey-auth-modal"
    >
      <div className="flex flex-col gap-5">
        {currentUser ? (
          /* User Profile & Credential details */
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono text-xl font-bold">
                  {currentUser.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-mono font-semibold text-zinc-100 flex items-center gap-2">
                    {currentUser.display_name}
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                      Passkey Active
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs font-mono text-zinc-400">Harmony Reputation</span>
                <p className="text-xl font-mono font-bold text-cyan-400 mt-1">
                  {currentUser.reputation_score} pts
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs font-mono text-zinc-400">Bridges Co-Created</span>
                <p className="text-xl font-mono font-bold text-pink-400 mt-1">
                  {currentUser.bridges_built || 3}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80 text-xs font-mono text-zinc-400 break-all">
              <span className="text-zinc-500 block text-[10px] uppercase">Credential Hash</span>
              {currentUser.credential_id || 'fido2-asserted-key'}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Done
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" aria-hidden="true" />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          /* Authentication Ceremony */
          <div className="flex flex-col gap-4">
            <div className="flex p-1 rounded-xl bg-zinc-950 border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-mono font-medium rounded-lg transition-all ${
                  mode === 'LOGIN'
                    ? 'bg-cyan-500 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Assert Passkey
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('REGISTER');
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-mono font-medium rounded-lg transition-all ${
                  mode === 'REGISTER'
                    ? 'bg-cyan-500 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Create Passkey
              </button>
            </div>

            {hasWebAuthnSupport ? (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0 text-cyan-400" aria-hidden="true" />
                <span>Biometric WebAuthn hardware authenticator detected & ready.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <KeyRound className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />
                <span>Embedded sandbox mode: WebCrypto cryptographic passkey assertion active.</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'LOGIN' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input
                  label="Registered Email (Optional for 1-Tap)"
                  type="email"
                  placeholder="your.name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="Leave empty to assert device credential directly."
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  leftIcon={<Fingerprint className="w-5 h-5" aria-hidden="true" />}
                  className="w-full"
                >
                  Verify Device Passkey
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <Input
                  label="Your Display Name"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="alex@commonground.world"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="Used only for public cryptographic fingerprinting."
                />
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={isLoading}
                  leftIcon={<Sparkles className="w-5 h-5" aria-hidden="true" />}
                  className="w-full"
                >
                  Generate Biometric Passkey
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
