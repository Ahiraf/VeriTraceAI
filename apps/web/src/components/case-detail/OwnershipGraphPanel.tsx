'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OwnershipGraph, OwnershipNode } from '@veritrace/types';
import { CustomNode, GraphControlsBar, NodeInspectorDrawer, EdgeFilterType } from './graph';
import { generateRandomOwnershipGraph } from '@/lib/graph-generator';

interface OwnershipGraphPanelProps {
  graphData: OwnershipGraph | null;
  caseId?: string;
}

const nodeTypes = {
  customNode: CustomNode,
};

const OwnershipGraphCanvas: React.FC<{
  graphData: OwnershipGraph;
  caseId: string;
  onRandomizeGraph: () => void;
}> = ({ graphData, caseId, onRandomizeGraph }) => {
  const { fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<OwnershipNode | null>(null);
  const [filter, setFilter] = useState<EdgeFilterType>('all');

  const positions: Record<string, { x: number; y: number }> = useMemo(
    () => ({
      p_01: { x: 180, y: 30 },
      e_01: { x: 180, y: 170 },
      e_02: { x: -20, y: 330 },
      e_03: { x: 380, y: 330 },
      p_02: { x: 580, y: 170 },
      p_21: { x: 100, y: 40 },
      e_22: { x: 360, y: 40 },
      e_21: { x: 230, y: 220 },
      p_31: { x: 80, y: 30 },
      e_31: { x: 80, y: 170 },
      p_32: { x: 380, y: 30 },
      e_32: { x: 230, y: 330 },
      p_41: { x: 100, y: 40 },
      e_41: { x: 360, y: 40 },
      e_42: { x: 230, y: 220 },
    }),
    []
  );

  const filteredEdges = useMemo(() => {
    return graphData.edges.filter((edge) => {
      if (filter === 'conflicts') return edge.conflict;
      if (filter === 'declared') return edge.provenance_type === 'declared';
      if (filter === 'observed') return edge.provenance_type === 'observed';
      return true;
    });
  }, [graphData.edges, filter]);

  const flowNodes: Node[] = useMemo(() => {
    return graphData.nodes.map((node, idx) => {
      const pos = positions[node.id] || {
        x: 100 + (idx % 3) * 220,
        y: 50 + Math.floor(idx / 3) * 160,
      };
      const isSelected = selectedNode?.id === node.id;

      return {
        id: node.id,
        type: 'customNode',
        position: pos,
        data: {
          node,
          isSelected,
        },
      };
    });
  }, [graphData.nodes, positions, selectedNode]);

  const flowEdges: Edge[] = useMemo(() => {
    return filteredEdges.map((edge) => {
      const isConflict = Boolean(edge.conflict);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: `${edge.percentage}% (${edge.provenance_type})`,
        animated: isConflict,
        style: {
          stroke: isConflict ? 'var(--finding-indicator)' : 'var(--primary)',
          strokeWidth: isConflict ? 2.5 : 1.75,
          strokeDasharray: isConflict ? '5 5' : undefined,
        },
        labelStyle: {
          fill: isConflict ? 'var(--finding-indicator)' : 'var(--foreground)',
          fontWeight: 600,
          fontSize: 10,
          fontFamily: 'var(--font-mono), monospace',
        },
        labelBgStyle: {
          fill: isConflict ? 'var(--finding-indicator-bg)' : 'var(--surface)',
          fillOpacity: 0.95,
          rx: 2,
          ry: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isConflict ? 'var(--finding-indicator)' : 'var(--primary)',
        },
      };
    });
  }, [filteredEdges]);

  const conflictCount = useMemo(
    () => graphData.edges.filter((e) => e.conflict).length,
    [graphData.edges]
  );

  const uboCount = useMemo(
    () => graphData.nodes.filter((n) => (n.ubo_percentage ?? 0) >= 25).length,
    [graphData.nodes]
  );

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.25, duration: 250 });
  }, [fitView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 200 });
    }, 50);
    return () => clearTimeout(timer);
  }, [graphData, fitView]);

  return (
    <div className="flex-1 flex flex-col min-h-[550px] h-[calc(100vh-210px)] relative bg-surface">
      <GraphControlsBar
        filter={filter}
        onFilterChange={setFilter}
        onFitView={handleFitView}
        onRandomizeGraph={onRandomizeGraph}
        conflictCount={conflictCount}
        totalNodes={graphData.nodes.length}
        uboCount={uboCount}
      />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        <div className="flex-1 h-full min-h-[480px] w-full relative">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => {
              const raw = (node.data as { node?: OwnershipNode }).node;
              if (raw) setSelectedNode(raw);
            }}
            fitView
            className="bg-background/40"
          >
            <Background color="var(--border)" gap={20} size={1} />
            <Controls showInteractive={false} className="border border-border rounded-xs shadow-sm bg-surface" />
          </ReactFlow>

          {/* Quick Legend Overlay */}
          <div className="absolute top-3 left-3 z-10 p-2.5 rounded-xs border border-border bg-surface/90 backdrop-blur text-[11px] flex flex-col gap-1 shadow-sm select-none">
            <span className="font-semibold text-foreground">Ownership Graph</span>
            <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
              <span className="h-1.5 w-3 bg-primary rounded-xs" />
              <span>Declared / Reconciled</span>
            </div>
            <div className="flex items-center gap-2 text-finding-indicator text-[10px]">
              <span className="h-1.5 w-3 bg-finding-indicator rounded-xs" />
              <span>Discrepancy (Amber Pulse)</span>
            </div>
          </div>
        </div>

        {selectedNode && (
          <NodeInspectorDrawer
            node={selectedNode}
            edges={graphData.edges}
            caseId={caseId}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};

export const OwnershipGraphPanel: React.FC<OwnershipGraphPanelProps> = ({
  graphData,
  caseId = 'case_001',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [variant, setVariant] = useState(1);
  const [activeGraph, setActiveGraph] = useState<OwnershipGraph>(() => {
    return graphData || generateRandomOwnershipGraph(caseId, 1);
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (graphData) {
      setActiveGraph(graphData);
    } else {
      setActiveGraph(generateRandomOwnershipGraph(caseId, 1));
    }
  }, [graphData, caseId]);

  const handleRandomize = useCallback(() => {
    setVariant((prev) => {
      const next = prev + 1;
      setActiveGraph(generateRandomOwnershipGraph(caseId, next));
      return next;
    });
  }, [caseId]);

  if (!isMounted) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-pulse w-full h-[500px] bg-border/20 rounded-xs" />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <OwnershipGraphCanvas
        graphData={activeGraph}
        caseId={caseId}
        onRandomizeGraph={handleRandomize}
      />
    </ReactFlowProvider>
  );
};
