import { Case, CaseStatus, Finding } from '@veritrace/types';

export const VALID_CASE_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  Intake: ['Extracting', 'Escalated'],
  Extracting: ['Resolving', 'Escalated'],
  Resolving: ['GraphBuilt', 'Escalated'],
  GraphBuilt: ['FindingsReady', 'Escalated'],
  FindingsReady: ['NarrativeDrafted', 'Escalated'],
  NarrativeDrafted: ['AnalystReview', 'Escalated'],
  AnalystReview: ['Cleared', 'EvidenceRequested', 'Escalated'],
  EvidenceRequested: ['AnalystReview', 'Escalated'],
  Cleared: ['AuditSealed'],
  Escalated: ['AuditSealed'],
  AuditSealed: []
};

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
}

export function validateCaseTransition(
  currentCase: Case,
  targetStatus: CaseStatus,
  caseFindings: Finding[]
): TransitionValidationResult {
  const allowedNext = VALID_CASE_TRANSITIONS[currentCase.status] || [];
  if (!allowedNext.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Cannot transition case from '${currentCase.status}' to '${targetStatus}'.`
    };
  }

  // Guard: Cannot clear case while open findings remain
  if (targetStatus === 'Cleared') {
    const openFindings = caseFindings.filter(
      (f) => f.case_id === currentCase.id && f.status === 'open'
    );
    if (openFindings.length > 0) {
      return {
        allowed: false,
        reason: `Cannot clear case: ${openFindings.length} open finding(s) require resolution first.`
      };
    }
  }

  return { allowed: true };
}
