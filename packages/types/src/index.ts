export type CaseStatus =
  | 'Intake'
  | 'Extracting'
  | 'Resolving'
  | 'GraphBuilt'
  | 'FindingsReady'
  | 'NarrativeDrafted'
  | 'AnalystReview'
  | 'Cleared'
  | 'EvidenceRequested'
  | 'Escalated'
  | 'AuditSealed';

export type JurisdictionMode = 'UK' | 'BD';

export interface Case {
  id: string;
  entity_name: string;
  registry_id: string;
  jurisdiction: JurisdictionMode;
  status: CaseStatus;
  assigned_investigator: string;
  finding_count: number;
  open_finding_count: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export type FindingType =
  | 'ownership_conflict'
  | 'address_mismatch'
  | 'screening_hit'
  | 'circular_ownership_detected';

export type FindingStatus = 'open' | 'acknowledged' | 'closed' | 'retracted';

export interface Finding {
  id: string;
  case_id: string;
  type: FindingType;
  label: string;
  summary: string;
  status: FindingStatus;
  declared_value?: string | number;
  observed_value?: string | number;
  evidence_ids: string[];
}

export interface ModelProvenance {
  model_task_type: 'entity_resolution' | 'ocr_extraction' | 'name_match';
  model_provider: string;
  model_identifier: string;
  confidence: number;
  latency_ms: number;
}

export interface Evidence {
  id: string;
  case_id: string;
  claim_type: string;
  source_type: 'document' | 'registry' | 'screening' | 'manual';
  source_reference: string;
  source_quote?: string;
  claim_value: Record<string, unknown>;
  provenance?: ModelProvenance;
  created_at: string;
}

export interface OwnershipNode {
  id: string;
  label: string;
  type: 'entity' | 'person';
  jurisdiction?: string;
  is_subject?: boolean;
  ubo_percentage?: number;
  is_pep?: boolean;
  sanction_status?: 'clear' | 'flagged';
  registration_number?: string;
}

export interface OwnershipEdge {
  id: string;
  source: string;
  target: string;
  percentage: number;
  provenance_type: 'declared' | 'observed' | 'reconciled';
  conflict?: boolean;
  filing_date?: string;
  source_doc_id?: string;
}

export interface OwnershipGraph {
  case_id: string;
  nodes: OwnershipNode[];
  edges: OwnershipEdge[];
}

export interface CaseDecision {
  id: string;
  case_id: string;
  decided_by: string;
  decision: 'Cleared' | 'EvidenceRequested' | 'Escalated';
  rationale: string;
  ofac_50_rule_checked: boolean;
  cryptographic_hash: string;
  decided_at: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  id: string;
  document_id: string;
  field_name: string;
  field_type: string;
  value: string;
  confidence: number;
  page_number: number;
  bounding_box: BoundingBox;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  title: string;
  filename: string;
  file_type: string;
  total_pages: number;
  sample_page_image: string;
  uploaded_at: string;
  extracted_fields: ExtractedField[];
}

