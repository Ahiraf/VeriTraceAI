'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { OwnershipNode } from '@veritrace/types';
import { Building2, User, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CustomNodeProps {
  data: {
    node: OwnershipNode;
    isSelected?: boolean;
    isHighlighted?: boolean;
  };
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const { node, isSelected } = data;
  const isPerson = node.type === 'person';
  const isFlagged = node.sanction_status === 'flagged';
  const isUbo = (node.ubo_percentage ?? 0) >= 25;

  return (
    <div
      className={`relative w-56 rounded-sm border bg-surface transition-all duration-150 shadow-sm text-left select-none ${
        isSelected
          ? 'border-primary ring-2 ring-primary/40 shadow-md bg-surface-raised'
          : node.is_subject
          ? 'border-primary/80 ring-1 ring-primary/30'
          : isFlagged
          ? 'border-escalated/70'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-border-strong !border-surface"
      />

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="p-1 rounded-xs bg-surface-raised border border-border text-primary shrink-0">
              {isPerson ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Building2 className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-foreground truncate" title={node.label}>
                {node.label}
              </span>
              <span className="block text-[10px] font-mono text-muted-foreground truncate">
                {node.registration_number || (isPerson ? 'Natural Person' : 'Corporate Entity')}
              </span>
            </div>
          </div>

          {node.jurisdiction && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase font-semibold rounded-xs bg-surface-raised border border-border text-foreground shrink-0">
              {node.jurisdiction}
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1">
            {isFlagged ? (
              <span className="inline-flex items-center gap-1 text-escalated font-medium">
                <AlertTriangle className="h-3 w-3" />
                <span>Sanctions Hit</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-success font-medium">
                <ShieldCheck className="h-3 w-3" />
                <span>Screened</span>
              </span>
            )}
          </div>

          {isUbo && (
            <span className="px-1.5 py-0.5 rounded-xs bg-finding-bg text-finding-indicator font-mono font-medium text-[9px]">
              UBO {node.ubo_percentage}%
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-border-strong !border-surface"
      />
    </div>
  );
};
