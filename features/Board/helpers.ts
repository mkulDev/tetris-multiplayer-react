import { PIECE_TYPES, TETRIS_SHAPES } from '@/components/blockTypes';
import { Board, CurrentPiece, PieceTypes, Rotation } from '../types';
import { Dispatch, SetStateAction } from 'react';

export const determNextPiece = () =>
  PIECE_TYPES?.[Math.floor(Math.random() * PIECE_TYPES?.length)];

export const generateNewPiece = (pieceType: PieceTypes): CurrentPiece => {
  const shape = TETRIS_SHAPES?.[pieceType]?.[0];
  const width = shape?.[0]?.length;
  const startingPoint = Math.floor(-width / 2 + 5);

  const NewPiece = {
    x: startingPoint,
    y: 0,
    rotation: 0 as Rotation,
    shape: shape as (PieceTypes | null)[][],
    type: pieceType,
  };
  return NewPiece;
};

export const onKeyPress = (
  e: KeyboardEvent,
  currentPiece: CurrentPiece | null,
  setCurrentPice: Dispatch<SetStateAction<CurrentPiece | null>>,
) => {
  const key = e.key;

  if (!currentPiece) return;

  const pieceWidth = currentPiece?.shape?.[0]?.length;
  const pieceHeight = currentPiece?.shape?.length;
  const currentX = currentPiece?.x;
  const currentY = currentPiece?.y;
  const currentRotation = currentPiece?.rotation;
  const nextRotation =
    currentPiece?.rotation < 3 ? currentRotation + 1 : (0 as Rotation);
  const newShape =
    TETRIS_SHAPES?.[currentPiece.type]?.[nextRotation as 0 | 1 | 2 | 3];
  if (key === 'ArrowRight') {
    if (currentX + pieceWidth > 9) return;
    setCurrentPice({ ...currentPiece, x: currentX + 1 });
  } else if (key === 'ArrowLeft') {
    if (currentX <= 0) return;
    setCurrentPice({ ...currentPiece, x: currentX - 1 });
  } else if (key === 'ArrowUp') {
    if (currentX + newShape?.[0]?.length <= 0) return;
    setCurrentPice({
      ...currentPiece,
      rotation: nextRotation as Rotation,
      shape: newShape as (PieceTypes | null)[][],
    });
  } else if (key === 'ArrowDown') {
    if (currentY + pieceHeight > 19) return;
    console.log({ ...currentPiece, y: currentY + 1 });
    setCurrentPice({ ...currentPiece, y: currentY + 1 });
  }
};

export const getDisplayBoard = (
  currentPiece: CurrentPiece | null,
  board: Board,
): Board => {
  const newBoard = board.map((row) => [...row]);
  if (!currentPiece) return newBoard;
  currentPiece.shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (!cell) return null;

      const y = currentPiece.y + dy;
      const x = currentPiece.x + dx;

      if (newBoard[y] && newBoard[y][x] !== undefined) {
        newBoard[y][x] = cell;
      }
    });
  });

  return newBoard;
};
