'use client';
import React from 'react';
import { PieceTypes } from '../types';
import { TETRIS_COLORS, TETRIS_SHAPES } from '@/components/blockTypes';

type CellSize = 'board' | 'preview';

const cellSizeClasses: Record<CellSize, string> = {
  board: 'aspect-square w-full h-full min-w-6',
  preview: 'aspect-square  w-4 h-4  xl:w-5 xl:h-5',
};

export const RenderEmptyCell = ({ size = 'board' }: { size?: CellSize }) => (
  <div
    className={`${cellSizeClasses[size]} box-border border-2 border-transparent`}
  />
);

export const RenderCell = ({
  softColor,
  mainColor,
  size = 'board',
}: {
  softColor: string;
  mainColor: string;
  size?: CellSize;
}) => (
  <div
    className={`${cellSizeClasses[size]} box-border border-2`}
    style={{
      borderColor: softColor,
      background: `linear-gradient(${softColor}, ${mainColor})`,
    }}
  />
);

export const RenderNextPieceBoard = ({ type }: { type: PieceTypes | null }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <div className="text-[8px] md:text-[11px] uppercase tracking-[0.22em] text-neutral-400">
          Upcoming
        </div>
        <div className="text-[12px] lg:text-[16px]  leading-4 font-semibold text-neutral-700">
          Next Piece
        </div>
      </div>

      <div className="flex items-center justify-center rounded-2xl min-h-[120px] px-2 py-2">
        {type ? (
          <RenderNextPiece type={type} />
        ) : (
          <span className="text-sm text-neutral-400">No piece</span>
        )}
      </div>
    </div>
  );
};

export const RenderNextPiece = ({ type }: { type: PieceTypes }) => {
  const shape = TETRIS_SHAPES[type][0];
  const [softColor, mainColor] = TETRIS_COLORS[type];

  return (
    <div className="flex flex-col items-center justify-center">
      {shape.map((row, y) => (
        <div key={y} className="flex w-fit">
          {row.map((cell, x) =>
            cell ? (
              <RenderCell
                key={`preview-cell-${y}-${x}`}
                softColor={softColor}
                mainColor={mainColor}
                size="preview"
              />
            ) : (
              <RenderEmptyCell key={`preview-empty-${y}-${x}`} size="preview" />
            ),
          )}
        </div>
      ))}
    </div>
  );
};
