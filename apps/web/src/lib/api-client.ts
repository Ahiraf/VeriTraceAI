import {
  Case,
  Finding,
  Evidence,
  OwnershipGraph,
  CaseDecision,
  CaseDocument
} from '@veritrace/types';
import casesData from './fixtures/cases.json';
import findingsData from './fixtures/findings.json';
import evidenceData from './fixtures/evidence.json';
import graphsData from './fixtures/ownership_graphs.json';
import documentsData from './fixtures/documents.json';
import narrativesData from './fixtures/narratives.json';
import { generateRandomOwnershipGraph } from './graph-generator';

const SIMULATED_LATENCY_MS = 250;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiClient {
  private useMock: boolean = true;
  private baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

  async getCases(): Promise<Case[]> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      return casesData as Case[];
    }
    const res = await fetch(`${this.baseUrl}/cases`);
    if (!res.ok) throw new Error('Failed to fetch cases');
    const json = await res.json();
    return json.items;
  }

  async getCaseById(caseId: string): Promise<Case | undefined> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      return (casesData as Case[]).find((c) => c.id === caseId);
    }
    const res = await fetch(`${this.baseUrl}/cases/${caseId}`);
    if (!res.ok) throw new Error('Failed to fetch case');
    return res.json();
  }

  async getFindings(caseId: string): Promise<Finding[]> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      return (findingsData as Finding[]).filter((f) => f.case_id === caseId);
    }
    const res = await fetch(`${this.baseUrl}/cases/${caseId}/findings`);
    if (!res.ok) throw new Error('Failed to fetch findings');
    return res.json();
  }

  async getEvidence(evidenceIds: string[]): Promise<Evidence[]> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      return (evidenceData as Evidence[]).filter((e) => evidenceIds.includes(e.id));
    }
    const res = await fetch(`${this.baseUrl}/evidence?ids=${evidenceIds.join(',')}`);
    if (!res.ok) throw new Error('Failed to fetch evidence');
    return res.json();
  }

  async getOwnershipGraph(caseId: string): Promise<OwnershipGraph> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      const graph = (
        graphsData as Record<string, { nodes: any[]; edges: any[] }>
      )[caseId];
      if (graph) {
        return { ...graph, case_id: caseId } as OwnershipGraph;
      }
      return generateRandomOwnershipGraph(caseId);
    }
    const res = await fetch(`${this.baseUrl}/cases/${caseId}/ownership-graph`);
    if (!res.ok) throw new Error('Failed to fetch ownership graph');
    return res.json();
  }

  async getRandomOwnershipGraph(caseId: string, variant?: number): Promise<OwnershipGraph> {
    await delay(150);
    return generateRandomOwnershipGraph(caseId, variant);
  }

  async getAllDocuments(): Promise<CaseDocument[]> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      return documentsData as CaseDocument[];
    }
    const res = await fetch(`${this.baseUrl}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  }

  async getDocument(caseId: string, documentId: string): Promise<CaseDocument | null> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS);
      const doc = (documentsData as CaseDocument[]).find(
        (d) => d.id === documentId && d.case_id === caseId
      );
      return doc || null;
    }
    const res = await fetch(`${this.baseUrl}/cases/${caseId}/documents/${documentId}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    return res.json();
  }

  async getNarrative(findingId: string): Promise<string | null> {
    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS / 2);
      return (narrativesData as Record<string, string>)[findingId] || null;
    }
    const res = await fetch(`${this.baseUrl}/findings/${findingId}/narrative`);
    if (!res.ok) throw new Error('Failed to fetch narrative');
    const data = await res.json();
    return data.narrative;
  }

  async recordDecision(
    caseId: string,
    findingId: string,
    decision: 'Cleared' | 'EvidenceRequested' | 'Escalated',
    rationale: string,
    ofacChecked: boolean
  ): Promise<CaseDecision> {
    if (rationale.trim().length < 10) {
      throw new Error('Decision rationale is strictly required (minimum 10 characters).');
    }

    if (this.useMock) {
      await delay(SIMULATED_LATENCY_MS * 1.5);
      return {
        id: `dec_${Date.now()}`,
        case_id: caseId,
        decided_by: 'A. Reyes (Investigator)',
        decision,
        rationale,
        ofac_50_rule_checked: ofacChecked,
        cryptographic_hash: `sha256:${Math.random().toString(16).substring(2, 18)}...`,
        decided_at: new Date().toISOString()
      };
    }

    const res = await fetch(`${this.baseUrl}/cases/${caseId}/findings/${findingId}/decision`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `idemp_${Date.now()}`
      },
      body: JSON.stringify({ decision, rationale, ofac_50_rule_checked: ofacChecked })
    });
    if (!res.ok) throw new Error('Failed to submit decision');
    return res.json();
  }
}

export const apiClient = new ApiClient();
