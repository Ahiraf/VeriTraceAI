import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Case, Finding, CaseDecision } from '@veritrace/types';
import casesDefault from '../lib/fixtures/cases.json';
import findingsDefault from '../lib/fixtures/findings.json';

interface SimulationStore {
  cases: Case[];
  findings: Finding[];
  decisions: CaseDecision[];
  activeCaseId: string | null;
  activeFindingId: string | null;

  setActiveCase: (caseId: string | null) => void;
  setActiveFinding: (findingId: string | null) => void;
  recordDecision: (
    caseId: string,
    findingId: string,
    decision: 'Cleared' | 'EvidenceRequested' | 'Escalated',
    rationale: string,
    ofacChecked: boolean
  ) => CaseDecision;
  simulateIntakeNewCase: (entityName: string, jurisdiction: 'UK' | 'BD') => Promise<string>;
  resetToDefault: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      cases: casesDefault as Case[],
      findings: findingsDefault as Finding[],
      decisions: [],
      activeCaseId: 'case_001',
      activeFindingId: 'find_001',

      setActiveCase: (caseId) => set({ activeCaseId: caseId }),
      setActiveFinding: (findingId) => set({ activeFindingId: findingId }),

      recordDecision: (caseId, findingId, decision, rationale, ofacChecked) => {
        const newDecision: CaseDecision = {
          id: `dec_${Date.now()}`,
          case_id: caseId,
          decided_by: 'A. Reyes (Lead Investigator)',
          decision,
          rationale,
          ofac_50_rule_checked: ofacChecked,
          cryptographic_hash: `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          decided_at: new Date().toISOString()
        };

        // Update finding
        const updatedFindings = get().findings.map((f) =>
          f.id === findingId ? { ...f, status: 'closed' as const } : f
        );

        // Check if all findings are addressed for the case
        const remainingOpen = updatedFindings.filter(
          (f) => f.case_id === caseId && f.status === 'open'
        ).length;

        const updatedCases = get().cases.map((c) => {
          if (c.id === caseId) {
            let nextStatus = c.status;
            if (decision === 'Escalated') nextStatus = 'Escalated';
            else if (decision === 'EvidenceRequested') nextStatus = 'EvidenceRequested';
            else if (decision === 'Cleared' && remainingOpen === 0) nextStatus = 'Cleared';

            return {
              ...c,
              status: nextStatus,
              open_finding_count: remainingOpen,
              version: c.version + 1,
              updated_at: new Date().toISOString()
            };
          }
          return c;
        });

        set({
          decisions: [newDecision, ...get().decisions],
          findings: updatedFindings,
          cases: updatedCases
        });

        return newDecision;
      },

      simulateIntakeNewCase: async (entityName, jurisdiction) => {
        const newId = `case_${Date.now().toString().slice(-4)}`;
        const regPrefix = jurisdiction === 'UK' ? 'UK-' : 'BD-C-';
        const newCase: Case = {
          id: newId,
          entity_name: entityName,
          registry_id: `${regPrefix}${Math.floor(100000 + Math.random() * 900000)}`,
          jurisdiction,
          status: 'Intake',
          assigned_investigator: 'A. Reyes',
          finding_count: 0,
          open_finding_count: 0,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set({ cases: [newCase, ...get().cases] });
        return newId;
      },

      resetToDefault: () => {
        set({
          cases: casesDefault as Case[],
          findings: findingsDefault as Finding[],
          decisions: [],
          activeCaseId: 'case_001',
          activeFindingId: 'find_001'
        });
      }
    }),
    {
      name: 'veritrace-simulation-store'
    }
  )
);
