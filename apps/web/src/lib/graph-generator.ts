import { OwnershipGraph, OwnershipNode, OwnershipEdge } from '@veritrace/types';

const JURISDICTIONS = ['UK', 'BD', 'CY', 'BVI', 'DE', 'SG', 'KY', 'NL', 'CH'];
const NAMES_PEOPLE = [
  'Erik Nordhaven',
  'Tariqul Islam',
  'Elena Rostova',
  'David Vance',
  'Marcus Sterling',
  'Amina Rahman',
  'Henrik Lindqvist',
  'Chen Wei',
  'Sophia Al-Mansoor',
];
const NAMES_ENTITIES = [
  'Apex Maritime Logistics',
  'Meridian Capital Partners',
  'Nordic Bulk Holdings',
  'Greenfield Subsidiary Ltd',
  'Bengal Shipping Corp',
  'Vanguard Maritime Trust',
  'Bosphorus Trade & Logistics',
  'Cyprus Marine Holdings SA',
  'Surma Freight Logistics',
];

export function generateRandomOwnershipGraph(caseId: string, variant = 0): OwnershipGraph {
  const seed = (variant || Math.floor(Math.random() * 1000)) + 1;
  const p1Name = NAMES_PEOPLE[(seed * 2) % NAMES_PEOPLE.length];
  const p2Name = NAMES_PEOPLE[(seed * 3 + 1) % NAMES_PEOPLE.length];
  const e1Name = NAMES_ENTITIES[(seed * 5) % NAMES_ENTITIES.length];
  const e2Name = NAMES_ENTITIES[(seed * 7 + 2) % NAMES_ENTITIES.length];
  const e3Name = NAMES_ENTITIES[(seed * 11 + 3) % NAMES_ENTITIES.length];

  const jur1 = JURISDICTIONS[(seed + 1) % JURISDICTIONS.length];
  const jur2 = JURISDICTIONS[(seed + 3) % JURISDICTIONS.length];
  const jur3 = JURISDICTIONS[(seed + 5) % JURISDICTIONS.length];

  const uboPercent = 50 + (seed % 35); // 50% - 84%
  const declaredSub = 30 + (seed % 20); // 30% - 49%
  const observedSub = declaredSub + 15; // Discrepancy delta +15%

  const nodes: OwnershipNode[] = [
    {
      id: 'p_01',
      label: p1Name,
      type: 'person',
      jurisdiction: jur1,
      is_pep: seed % 5 === 0,
      sanction_status: seed % 7 === 0 ? 'flagged' : 'clear',
      ubo_percentage: uboPercent,
    },
    {
      id: 'e_01',
      label: e1Name,
      type: 'entity',
      jurisdiction: jur1,
      is_subject: true,
      registration_number: `${jur1}-${100000 + (seed % 899999)}`,
      sanction_status: 'clear',
    },
    {
      id: 'e_02',
      label: e2Name,
      type: 'entity',
      jurisdiction: jur2,
      registration_number: `${jur2}-${200000 + (seed % 799999)}`,
      sanction_status: 'clear',
    },
    {
      id: 'e_03',
      label: e3Name,
      type: 'entity',
      jurisdiction: jur3,
      registration_number: `${jur3}-${300000 + (seed % 699999)}`,
      sanction_status: 'clear',
    },
    {
      id: 'p_02',
      label: p2Name,
      type: 'person',
      jurisdiction: jur2,
      is_pep: false,
      sanction_status: 'clear',
      ubo_percentage: 100 - uboPercent,
    },
  ];

  const edges: OwnershipEdge[] = [
    {
      id: `ed_rand_01_${seed}`,
      source: 'p_01',
      target: 'e_01',
      percentage: uboPercent,
      provenance_type: 'declared',
      filing_date: '2026-01-15',
    },
    {
      id: `ed_rand_02_${seed}`,
      source: 'e_01',
      target: 'e_02',
      percentage: declaredSub,
      provenance_type: 'declared',
      conflict: true,
      filing_date: '2026-06-20',
    },
    {
      id: `ed_rand_03_${seed}`,
      source: 'e_01',
      target: 'e_02',
      percentage: observedSub,
      provenance_type: 'observed',
      conflict: true,
      filing_date: '2025-12-10',
    },
    {
      id: `ed_rand_04_${seed}`,
      source: 'e_01',
      target: 'e_03',
      percentage: 60,
      provenance_type: 'reconciled',
      filing_date: '2025-11-05',
    },
    {
      id: `ed_rand_05_${seed}`,
      source: 'p_02',
      target: 'e_03',
      percentage: 40,
      provenance_type: 'reconciled',
      filing_date: '2025-11-05',
    },
  ];

  return {
    case_id: caseId,
    nodes,
    edges,
  };
}
