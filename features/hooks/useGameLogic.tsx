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
type ControlBinding = {
  label: string;
  key: string;
};
export interface Controls {
  rotate: ControlBinding;
  left: ControlBinding;
  right: ControlBinding;
  softDrop: ControlBinding;
  hardDrop: ControlBinding;
}

export type PlayerIndex = 0 | 1 | 2 | 3;
export interface SettingsType {
  activePlayers: boolean[];
  isGamePaused: boolean;
  controls: Record<PlayerIndex, Controls>;
}

type ControlKey = keyof Controls;

export interface keyListeningType {
  isOn: boolean;
  playerID: PlayerIndex | null;
  position: ControlKey | null;
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

const initialSetting = {
  activePlayers: [true, false, false, false],
  isGamePaused: true,

  controls: {
    0: {
      rotate: {
        label: 'W',
        key: 'KeyW',
      },
      left: {
        label: 'A',
        key: 'KeyA',
      },
      right: {
        label: 'D',
        key: 'KeyD',
      },
      softDrop: {
        label: 'S',
        key: 'KeyS',
      },
      hardDrop: {
        label: 'Tab',
        key: 'Tab',
      },
    },

    1: {
      rotate: {
        label: '↑',
        key: 'ArrowUp',
      },
      left: {
        label: '←',
        key: 'ArrowLeft',
      },
      right: {
        label: '→',
        key: 'ArrowRight',
      },
      softDrop: {
        label: '↓',
        key: 'ArrowDown',
      },
      hardDrop: {
        label: 'Enter',
        key: 'Enter',
      },
    },

    2: {
      rotate: {
        label: '8',
        key: 'Numpad8',
      },
      left: {
        label: '4',
        key: 'Numpad4',
      },
      right: {
        label: '6',
        key: 'Numpad6',
      },
      softDrop: {
        label: '5',
        key: 'Numpad5',
      },
      hardDrop: {
        label: '0',
        key: 'Numpad0',
      },
    },

    3: {
      rotate: {
        label: 'I',
        key: 'KeyI',
      },
      left: {
        label: 'J',
        key: 'KeyJ',
      },
      right: {
        label: 'L',
        key: 'KeyL',
      },
      softDrop: {
        label: 'K',
        key: 'KeyK',
      },
      hardDrop: {
        label: 'U',
        key: 'KeyU',
      },
    },
  },
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
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(initialSetting);
  const [model, setModel] = useState<(ModelObject | null)[]>([]);
  const [gameToast, setGameToast] = useState('');
  const [keyListening, setKeyListening] = useState<keyListeningType>({
    isOn: false,
    playerID: null,
    position: null,
  });
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

  const startKeyBinding = (playerID: PlayerIndex, position: keyof Controls) => {
    if (typeof playerID !== 'number' || !position) return;
    setKeyListening((prev) => ({
      isOn: true,
      playerID: playerID,
      position: position,
    }));
  };

  const openControlModal = () => {
    setSettings((prev) => ({ ...prev, isGamePaused: true }));
    setIsControlModalOpen(true);
  };

  const closeControlModal = () => {
    setSettings((prev) => ({ ...prev, isGamePaused: true }));

    setIsControlModalOpen(false);
  };

  const handleKeyBinding = (label: string, value: string) => {
    const playerID = keyListening.playerID;
    const position = keyListening.position;

    if (typeof playerID !== 'number' || !position || !value || !label) {
      return;
    }

    setSettings((prev) => {
      const currentAssignedKey = prev.controls[playerID][position]?.key;
      const assignedKeys = Object.values(prev.controls).flatMap(
        (playerControls) =>
          Object.values(playerControls)?.map((element) => element?.key),
      );

      const isKeyTaken =
        value !== currentAssignedKey &&
        [...assignedKeys, 'KeyP'].includes(value);

      if (isKeyTaken) {
        setGameToast('Sorry, this key is already assigned.');
        return prev;
      }

      return {
        ...prev,
        controls: {
          ...prev.controls,
          [playerID]: {
            ...prev.controls[playerID],
            [position]: {
              label: label?.trim() ? label : 'Space Bar',
              key: value,
            },
          },
        },
      };
    });

    setKeyListening({ isOn: false, playerID: null, position: null });
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
        if (player.isGameEnded) return player;
        return applyGravityToPlayer(player);
      }),
    );
  }, [settings.isGamePaused, applyGravityToPlayer]);

  const handleActivePlayerClick = useCallback((value: number) => {
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
        isGamePaused: true,
        activePlayers: newValue,
      };
    });
  }, []);

  const handleNewGame = useCallback(() => {
    setModel((prev) => {
      const players = settings.activePlayers.map((isActive, index) => {
        if (!isActive) return null;

        return createInitialPlayerModel();
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
      localStorage.setItem('arcadeTETRIS-game', JSON.stringify(model));
      setGameToast('Game saved!');
    } catch (error) {
      setGameToast((error as Error)?.message);
    }
  }, [model]);

  const handleSettingsLoad = useCallback(() => {
    const rawSavedSettings = localStorage.getItem('arcadeTETRIS-controls');

    if (!rawSavedSettings) {
      setGameToast('No saved controls available');
      return;
    }
    const savedSetting = JSON?.parse(rawSavedSettings);

    if (!savedSetting) {
      setGameToast('Sorry, error occurred');
      return;
    }

    setSettings(savedSetting);
  }, []);

  const handleGameLoad = useCallback(() => {
    const rawSavedGame = localStorage.getItem('arcadeTETRIS-game');

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
      const activePlayers = savedGame.map((player) => player !== null);

      setModel(savedGame);
      setSettings((prev) => ({
        ...prev,
        isGamePaused: true,
        activePlayers,
      }));
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
      e.preventDefault();
      e.stopPropagation();
      const currentKey = e.code;

      if (currentKey === 'KeyP') {
        handleGamePause();
        return;
      }

      if (keyListening.isOn) return;
      const { controls } = settings;
      Object.entries(controls).forEach(([playerIndex, playerControls]) => {
        const playerID = Number(playerIndex);

        if (currentKey === playerControls?.left?.key) {
          changeHorizontalPosition(playerID, 0);
        }
        if (currentKey === playerControls?.right?.key) {
          changeHorizontalPosition(playerID, 1);
        }
        if (currentKey === playerControls?.rotate?.key) {
          changeShape(playerID);
        }
        if (currentKey === playerControls?.softDrop?.key) {
          softDrop(playerID);
        }
        if (currentKey === playerControls?.hardDrop?.key) {
          hardDrop(playerID);
        }
      });
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
    handleSettingsLoad();
  }, []);

  useEffect(() => {
    const handleKeyboardPress = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleKeyboardPress);

    return () => {
      document.removeEventListener('keydown', handleKeyboardPress);
    };
  }, [handleKeyDown, settings.controls]);

  useEffect(() => {
    const tickSpeed = speedByLevel[Math.min(level, 15)];

    const interval = setInterval(() => {
      executeTick();
    }, tickSpeed);

    return () => clearInterval(interval);
  }, [executeTick, level]);

  useEffect(() => {
    if (!keyListening.isOn) return;

    const handleKeyBindPress = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleKeyBinding(e.key, e.code);
    };

    document.addEventListener('keydown', handleKeyBindPress);

    return () => {
      document.removeEventListener('keydown', handleKeyBindPress);
    };
  }, [keyListening.isOn, handleKeyBinding]);

  useEffect(() => {
    if (!gameToast) return;

    const timeout = setTimeout(() => {
      setGameToast('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [gameToast]);

  useEffect(() => {
    localStorage.setItem('arcadeTETRIS-controls', JSON.stringify(settings));
  }, [settings]);

  const handlers = useMemo(
    () => ({
      handleActivePlayerClick,
      handleGameSave,
      handleGameLoad,
      handleGamePause,
      handleNewGame,
      openControlModal,
      closeControlModal,
      handleKeyBinding,
      startKeyBinding,
    }),
    [
      handleActivePlayerClick,
      handleGameSave,
      handleGameLoad,
      handleGamePause,
      handleNewGame,
      openControlModal,
      closeControlModal,
      handleKeyBinding,
      startKeyBinding,
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
    isControlModalOpen,
    startKeyBinding,
    keyListening,
    handlers,
    totalLines,
    level,
    gameToast,
  };
};
