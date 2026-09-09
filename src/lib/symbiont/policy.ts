export type CommonGroundSensitiveScope =
  | "camera:capture"
  | "location:precise"
  | "ai:analyze_submission"
  | "ecosystem:share_submission";

export interface CommonGroundConsentReceipt {
  readonly subjectId: string;
  readonly scope: CommonGroundSensitiveScope;
  readonly status: "granted" | "denied" | "revoked" | "expired";
  readonly grantedAt: string;
  readonly expiresAt?: string;
  readonly revokedAt?: string;
  readonly policyVersion: "common-ground-symbiont-v1";
}

export interface CommonGroundPolicyDecision {
  readonly allowed: boolean;
  readonly reason:
    | "allowed"
    | "consent_missing"
    | "consent_inactive"
    | "cross_product_default_deny";
}

export function mayUseSensitiveCapability(input: {
  readonly subjectId: string;
  readonly scope: CommonGroundSensitiveScope;
  readonly receipts: readonly CommonGroundConsentReceipt[];
  readonly now: string;
  readonly crossProduct?: boolean;
}): CommonGroundPolicyDecision {
  if (input.crossProduct && input.scope !== "ecosystem:share_submission") {
    return { allowed: false, reason: "cross_product_default_deny" };
  }

  const receipt = input.receipts.find(
    (candidate) =>
      candidate.subjectId === input.subjectId && candidate.scope === input.scope,
  );
  if (!receipt) return { allowed: false, reason: "consent_missing" };
  if (receipt.status !== "granted" || receipt.revokedAt) {
    return { allowed: false, reason: "consent_inactive" };
  }

  if (receipt.expiresAt) {
    const expires = Date.parse(receipt.expiresAt);
    const current = Date.parse(input.now);
    if (Number.isNaN(expires) || Number.isNaN(current) || current >= expires) {
      return { allowed: false, reason: "consent_inactive" };
    }
  }

  return { allowed: true, reason: "allowed" };
}

export const COMMON_GROUND_DATA_RULES = Object.freeze({
  preciseLocationRetention: "off-by-default",
  cameraCaptureRetention: "off-by-default",
  aiSubmissionUse: "purpose-bound",
  crossProductSharing: "explicit-opt-in-only",
  memory: "separate-consent-required",
});
