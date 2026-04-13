'use client';
import React from 'react';
import { BoardRow, CurrentPiece } from '../types';
import { TETRIS_COLORS } from '@/components/blockTypes';
import { RenderCell, RenderEmptyCell } from './RenderNextPiece';
import { getDisplayBoard } from '../Board/helpers';

interface RenderBoardProps {
  BoardState: BoardRow[];
  currentPiece: CurrentPiece | null;
  isDisabled: boolean;
}

export const RenderBoard = ({ BoardState, currentPiece }: RenderBoardProps) => {
  const displayBoard = getDisplayBoard(currentPiece, BoardState);

  return (
    <div className="grid grid-cols-10 w-full h-full">
      {displayBoard.map((row, y) =>
        row.map((cell, x) => {
          const [softColor, mainColor] = cell
            ? TETRIS_COLORS[cell]
            : ['#ccc', '#ccc'];

          return cell ? (
            <RenderCell
              key={`board-cell-${y}-${x}`}
              softColor={softColor}
              mainColor={mainColor}
              size="board"
            />
          ) : (
            <RenderEmptyCell key={`board-empty-${y}-${x}`} size="board" />
          );
        }),
      )}
    </div>
  );
};

export default React.memo(RenderBoard);
