export type PieceTypes = 'O' | 'T' | 'I' | 'S' | 'Z' | 'J' | 'L';

export type BoardRow = (PieceTypes | null)[];
export type Board = BoardRow[];

export interface CurrentPiece {
  x: number;
  y: number;
  rotation: 0 | 1 | 2 | 3;
  shape: (PieceTypes | null)[][];
  type: PieceTypes;
}

export type Rotation = 0 | 1 | 2 | 3;

export interface SavedGame {
  p1: {
    piece: CurrentPiece | null;
    nextPiece: PieceTypes | null;
    board: BoardRow[];
  };
  p2: {
    piece: CurrentPiece | null;
    nextPiece: PieceTypes | null;
    board: BoardRow[];
  };
  scores: [number, number];
  playerMode: { p1: boolean; p2: boolean };
}
