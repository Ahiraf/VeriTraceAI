import { create } from 'zustand';

export type DecisionType = 'Cleared' | 'EvidenceRequested' | 'Escalated';

interface CaseDetailState {
  activeFindingId: string | null;
  isDecisionDialogOpen: boolean;
  decisionType: DecisionType | null;
  rationaleDraft: string;
  ofacChecked: boolean;
  isSubmitting: boolean;

  setActiveFindingId: (id: string | null) => void;
  openDecisionDialog: (type: DecisionType) => void;
  closeDecisionDialog: () => void;
  setRationaleDraft: (text: string) => void;
  setOfacChecked: (checked: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  resetDecisionDraft: () => void;
}

export const useCaseDetailStore = create<CaseDetailState>((set) => ({
  activeFindingId: null,
  isDecisionDialogOpen: false,
  decisionType: null,
  rationaleDraft: '',
  ofacChecked: true,
  isSubmitting: false,

  setActiveFindingId: (activeFindingId) => set({ activeFindingId }),
  openDecisionDialog: (decisionType) =>
    set({
      isDecisionDialogOpen: true,
      decisionType,
      rationaleDraft: '',
      isSubmitting: false,
    }),
  closeDecisionDialog: () =>
    set({
      isDecisionDialogOpen: false,
      decisionType: null,
      isSubmitting: false,
    }),
  setRationaleDraft: (rationaleDraft) => set({ rationaleDraft }),
  setOfacChecked: (ofacChecked) => set({ ofacChecked }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  resetDecisionDraft: () =>
    set({
      isDecisionDialogOpen: false,
      decisionType: null,
      rationaleDraft: '',
      isSubmitting: false,
    }),
}));
