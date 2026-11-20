'use client';

import React from 'react';
import Image from 'next/image';
import { ExtractedField } from '@veritrace/types';

interface DocumentCanvasProps {
  sampleImage: string;
  zoom: number;
  extractedFields: ExtractedField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  sampleImage,
  zoom,
  extractedFields,
  selectedFieldId,
  onSelectField,
}) => {
  const scale = zoom / 100;
  const baseWidth = 800;
  const baseHeight = 1050;

  return (
    <div className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-8 flex justify-center items-start">
      <div
        className="relative bg-surface border border-border shadow-md rounded-xs transition-transform duration-100 origin-top"
        style={{
          width: `${baseWidth * scale}px`,
          height: `${baseHeight * scale}px`,
        }}
      >
        {/* Document Page Canvas Image */}
        <Image
          src={sampleImage}
          alt="Statutory Shareholder Document Page 3"
          width={baseWidth}
          height={baseHeight}
          className="w-full h-full object-contain pointer-events-none select-none"
          priority
        />

        {/* SVG Bounding Boxes Overlay */}
        <svg
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-label="Extracted document region overlays"
        >
          {extractedFields.map((field) => {
            const isSelected = field.id === selectedFieldId;
            const { x, y, width, height } = field.bounding_box;

            return (
              <g key={field.id} className="pointer-events-auto cursor-pointer">
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={2}
                  onClick={() => onSelectField(field.id)}
                  className={`transition-all duration-150 ${
                    isSelected
                      ? 'stroke-finding-indicator fill-finding-indicator/20 stroke-[3]'
                      : 'stroke-finding-indicator/80 fill-transparent hover:fill-finding-indicator/15 stroke-2 stroke-dashed hover:stroke-solid'
                  }`}
                />
                {isSelected && (
                  <rect
                    x={x}
                    y={y - 18}
                    width={130}
                    height={16}
                    rx={2}
                    className="fill-finding-indicator"
                  />
                )}
                {isSelected && (
                  <text
                    x={x + 4}
                    y={y - 6}
                    fontSize={10}
                    fill="#FFFFFF"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {field.field_name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
