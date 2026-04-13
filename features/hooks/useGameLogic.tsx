'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BoardRow, CurrentPiece, PieceTypes } from '../types';
import { STARTING_BOARD, TETRIS_SHAPES } from '@/components/blockTypes';
import { determNextPiece, generateNewPiece } from '../Board/helpers';

export interface ModelObject {
  currentPiece: CurrentPiece;
  nextPiece: PieceTypes;
  board: BoardRow[];
  lines: number;
  score: number;
  isGameEnded: boolean;
}

const createEmptyBoard = () => STARTING_BOARD.map((row) => [...row]);

const createInitialPlayerModel = (): ModelObject => ({
  currentPiece: generateNewPiece(determNextPiece() as PieceTypes),
  nextPiece: determNextPiece() as PieceTypes,
  board: createEmptyBoard(),
  lines: 0,
  score: 0,
  isGameEnded: false,
});

const initialSeting = {
  activePlayers: [true, false, false, false],
  isGamePaused: true,
};
const scoreByLines: Record<number, number> = {
  0: 0,
  1: 100,
  2: 220,
  3: 350,
  4: 500,
};
const speedByLevel: Record<number, number> = {
  1: 800,
  2: 700,
  3: 600,
  4: 500,
  5: 400,
  6: 350,
  7: 300,
  8: 250,
  9: 200,
  10: 160,
  11: 140,
  12: 120,
  13: 110,
  14: 100,
  15: 90,
};

const isPositionValid = (board: BoardRow[], currentPiece: CurrentPiece) => {
  for (let i = 0; i < currentPiece.shape.length; i++) {
    for (let j = 0; j < currentPiece.shape[i].length; j++) {
      const cell = currentPiece.shape[i][j];
      if (!cell) continue;

      const dy = currentPiece.y + i;
      const dx = currentPiece.x + j;

      const isXInBoard = dx >= 0 && dx < board[0].length;
      const isYInBoard = dy >= 0 && dy < board.length;

      if (!isXInBoard || !isYInBoard) return false;
      if (board[dy][dx] !== null) return false;
    }
  }

  return true;
};

const mergeToBoard = (board: BoardRow[], currentPiece: CurrentPiece) => {
  const newBoard = board.map((row) => [...row]);

  for (let i = 0; i < currentPiece.shape.length; i++) {
    for (let j = 0; j < currentPiece.shape[i].length; j++) {
      const dy = currentPiece.y + i;
      const dx = currentPiece.x + j;
      const newCellValue = currentPiece.shape[i][j];

      if (newCellValue) {
        newBoard[dy][dx] = newCellValue;
      }
    }
  }

  return newBoard;
};

export const useGameLogic = () => {
  const [settings, setSettings] = useState(initialSeting);
  const [model, setModel] = useState<(ModelObject | null)[]>([]);
  const [gameToast, setGameToast] = useState('');

  const [player1, player2, player3, player4] = model;

  const totalLines = useMemo(() => {
    return model.reduce((acc, player) => acc + (player?.lines ?? 0), 0);
  }, [model]);

  const level = useMemo(() => {
    return Math.max(1, Math.floor(totalLines / 10) + 1);
  }, [totalLines]);

  const clearFullLines = (board: BoardRow[], level: number) => {
    const filteredBoard = board.filter((row) =>
      row.some((cell) => cell === null),
    );
    const clearedLines = board.length - filteredBoard.length;

    while (filteredBoard.length < board.length) {
      filteredBoard.unshift(Array.from({ length: 10 }).fill(null) as BoardRow);
    }

    const baseScore = scoreByLines[clearedLines] ?? 0;
    const gainedScore = Math.round(baseScore * (1 + level * 0.1));

    return { filteredBoard, clearedLines, gainedScore };
  };

  const lockPlayerPiece = useCallback(
    (
      player: ModelObject,
      level: number,
      pieceToLock?: CurrentPiece,
    ): ModelObject => {
      if (player.isGameEnded) return player;

      const finalPiece = pieceToLock ?? player.currentPiece;
      const mergedBoard = mergeToBoard(player.board, finalPiece);
      const { filteredBoard, clearedLines, gainedScore } = clearFullLines(
        mergedBoard,
        level,
      );

      const spawnedPiece = generateNewPiece(player.nextPiece);
      const nextPieceType = determNextPiece() as PieceTypes;
      const isEnd = !isPositionValid(filteredBoard, spawnedPiece);

      return {
        ...player,
        board: filteredBoard,
        currentPiece: spawnedPiece,
        nextPiece: nextPieceType,
        lines: player.lines + clearedLines,
        score: player.score + gainedScore,
        isGameEnded: isEnd,
      };
    },
    [],
  );

  const applyGravityToPlayer = useCallback(
    (player: ModelObject) => {
      if (player.isGameEnded) return player;

      const currentBoard = player.board;
      const playerPiece = player.currentPiece;

      if (
        isPositionValid(currentBoard, { ...playerPiece, y: playerPiece.y + 1 })
      ) {
        return {
          ...player,
          currentPiece: {
            ...player.currentPiece,
            y: playerPiece.y + 1,
          },
        };
      }

      return lockPlayerPiece(player, level);
    },
    [level, lockPlayerPiece],
  );

  const executeTick = useCallback(() => {
    if (settings.isGamePaused) return;

    setModel((prev) =>
      prev.map((player) => {
        if (!player) return null;
        return applyGravityToPlayer(player);
      }),
    );
  }, [settings.isGamePaused, applyGravityToPlayer]);

  const handleAcitvePlayerClick = useCallback((value: number) => {
    setSettings((prev) => {
      const newValue = [...prev.activePlayers];

      if (newValue[value] && newValue.filter((e) => e).length === 1) {
        return prev;
      }

      newValue[value] = !newValue[value];

      setModel(
        newValue.map((isActive) =>
          isActive ? createInitialPlayerModel() : null,
        ),
      );

      return {
        ...prev,
        activePlayers: newValue,
      };
    });
  }, []);

  const handleNewGame = useCallback(() => {
    setModel((prev) => {
      const players = settings.activePlayers.map((isActive, index) => {
        if (!isActive) return null;

        return prev[index]
          ? createInitialPlayerModel()
          : createInitialPlayerModel();
      });

      return players;
    });

    setSettings((prev) => ({
      ...prev,
      isGamePaused: true,
    }));
  }, [settings.activePlayers]);

  const handleGamePause = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      isGamePaused: !prev.isGamePaused,
    }));
  }, []);

  const handleGameSave = useCallback(() => {
    try {
      localStorage.setItem('TetrisSetup', JSON.stringify(model));
      setGameToast('Game saved!');
    } catch (error) {
      setGameToast((error as Error)?.message);
    }
  }, [model]);

  const handleGameLoad = useCallback(() => {
    const rawSavedGame = localStorage.getItem('TetrisSetup');

    try {
      setSettings((prev) => ({ ...prev, isGamePaused: true }));

      if (!rawSavedGame) {
        setGameToast('No saved game available');
        return;
      }

      const savedGame: (ModelObject | null)[] = JSON.parse(rawSavedGame);

      if (!savedGame) {
        setGameToast('Sorry, error occurred');
        return;
      }

      setModel(savedGame);
    } catch {
      setGameToast('Sorry, error occurred');
    }
  }, []);

  const changeHorizontalPosition = useCallback(
    (playerID: number, direction: 0 | 1) => {
      if (settings.isGamePaused) return;

      setModel((prev) =>
        prev.map((element, index) => {
          if (!element) return null;
          if (index !== playerID) return element;

          const currentBoard = element.board;
          const playerPiece = element.currentPiece;
          let newXvalue = playerPiece.x;

          if (
            direction === 0 &&
            isPositionValid(currentBoard, { ...playerPiece, x: newXvalue - 1 })
          ) {
            newXvalue--;
          }

          if (
            direction === 1 &&
            isPositionValid(currentBoard, { ...playerPiece, x: newXvalue + 1 })
          ) {
            newXvalue++;
          }

          return {
            ...element,
            currentPiece: {
              ...element.currentPiece,
              x: newXvalue,
            },
          };
        }),
      );
    },
    [settings.isGamePaused],
  );

  const changeShape = useCallback(
    (playerID: number) => {
      if (settings.isGamePaused) return;

      setModel((prev) =>
        prev.map((element, index) => {
          if (!element) return null;
          if (index !== playerID) return element;

          const currentBoard = element.board;
          const playerPiece = element.currentPiece;
          const newRotation =
            playerPiece.rotation < 3 ? playerPiece.rotation + 1 : 0;
          const currentType = playerPiece.type;
          const newShape =
            TETRIS_SHAPES[currentType][newRotation as 0 | 1 | 2 | 3];

          if (
            isPositionValid(currentBoard, {
              ...playerPiece,
              rotation: newRotation as 0 | 1 | 2 | 3,
              shape: newShape as (PieceTypes | null)[][],
            })
          ) {
            return {
              ...element,
              currentPiece: {
                ...element.currentPiece,
                rotation: newRotation as 0 | 1 | 2 | 3,
                shape: newShape as (PieceTypes | null)[][],
              },
            };
          }

          return element;
        }),
      );
    },
    [settings.isGamePaused],
  );

  const softDrop = useCallback(
    (playerID: number) => {
      if (settings.isGamePaused) return;

      setModel((prev) =>
        prev.map((element, index) => {
          if (!element) return null;
          if (index !== playerID) return element;

          return applyGravityToPlayer(element);
        }),
      );
    },
    [settings.isGamePaused, applyGravityToPlayer],
  );

  const hardDrop = useCallback(
    (playerID: number) => {
      if (settings.isGamePaused) return;

      setModel((prev) =>
        prev.map((element, index) => {
          if (!element) return null;
          if (index !== playerID) return element;
          if (element.isGameEnded) return element;

          const currentBoard = element.board;
          const playerPiece = element.currentPiece;

          let finalY = playerPiece.y;

          while (
            isPositionValid(currentBoard, { ...playerPiece, y: finalY + 1 })
          ) {
            finalY++;
          }

          const finalPiece = {
            ...playerPiece,
            y: finalY,
          };

          return lockPlayerPiece(element, level, finalPiece);
        }),
      );
    },
    [settings.isGamePaused, level, lockPlayerPiece],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const currentKey = e.key;

      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(
          currentKey,
        )
      ) {
        e.preventDefault();
      }

      switch (currentKey) {
        case 'ArrowLeft':
          changeHorizontalPosition(1, 0);
          break;
        case 'ArrowRight':
          changeHorizontalPosition(1, 1);
          break;
        case 'ArrowUp':
          changeShape(1);
          break;
        case 'ArrowDown':
          softDrop(1);
          break;
        case 'Control':
          hardDrop(1);
          break;

        case '4':
          changeHorizontalPosition(2, 0);
          break;
        case '6':
          changeHorizontalPosition(2, 1);
          break;
        case '8':
          changeShape(2);
          break;
        case '5':
          softDrop(2);
          break;
        case '0':
          hardDrop(2);
          break;

        case 'a':
        case 'A':
          changeHorizontalPosition(0, 0);
          break;
        case 'd':
        case 'D':
          changeHorizontalPosition(0, 1);
          break;
        case 'w':
        case 'W':
          changeShape(0);
          break;
        case 's':
        case 'S':
          softDrop(0);
          break;
        case 'Tab':
          hardDrop(0);
          break;

        case 'p':
        case 'P':
          handleGamePause();
          break;
      }
    },
    [
      changeHorizontalPosition,
      changeShape,
      softDrop,
      hardDrop,
      handleGamePause,
    ],
  );

  useEffect(() => {
    const handleKeyboardPress = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleKeyboardPress);

    return () => {
      document.removeEventListener('keydown', handleKeyboardPress);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const tickSpeed = speedByLevel[Math.min(level, 15)];

    const interval = setInterval(() => {
      executeTick();
    }, tickSpeed);

    return () => clearInterval(interval);
  }, [executeTick, level]);

  const handlers = useMemo(
    () => ({
      handleAcitvePlayerClick,
      handleGameSave,
      handleGameLoad,
      handleGamePause,
      handleNewGame,
    }),
    [
      handleAcitvePlayerClick,
      handleGameSave,
      handleGameLoad,
      handleGamePause,
      handleNewGame,
    ],
  );

  return {
    player1,
    player2,
    player3,
    player4,
    model,
    settings,
    setSettings,
    handlers,
    totalLines,
    level,
    gameToast,
  };
};
