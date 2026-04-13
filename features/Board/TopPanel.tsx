import React, { Dispatch, SetStateAction } from 'react';

interface TopPanelProps {
  settings: {
    activePlayers: boolean[];
    isGamePaused: boolean;
  };
  setSettings: Dispatch<
    SetStateAction<{
      activePlayers: boolean[];
      isGamePaused: boolean;
    }>
  >;
  totalLines: number;
  level: number;
  handlers: {
    handleAcitvePlayerClick: (value: number) => void;
    handleGameSave: () => void;
    handleGameLoad: () => void;
    handleGamePause: () => void;
    handleNewGame: () => void;
  };
}

const TopPanel = ({ settings, handlers, totalLines, level }: TopPanelProps) => {
  return (
    <div className="w-full rounded-3xl border border-white/50 bg-white/55 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
      <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-[220px] flex-col justify-center rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-neutral-100/70 px-5 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Arcade Session
          </span>
          <span className="mt-1 text-[28px] font-bold tracking-tight text-neutral-900">
            Tetris <span className="font-medium text-neutral-500">by mkul</span>
          </span>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <div className="rounded-2xl border w-full border-white/60 bg-gradient-to-br from-white/80 to-neutral-100/70 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Players
            </span>
            <div className="flex flex-wrap gap-2">
              {settings.activePlayers.map((element, i) => {
                const isActive = element;

                return (
                  <button
                    key={i}
                    type="button"
                    className={`rounded-2xl cursor-pointer border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200  ${
                      isActive
                        ? 'border-blue-700 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]'
                        : 'border-neutral-200 bg-white/80 text-neutral-700 hover:border-neutral-300 hover:bg-white'
                    }`}
                    onClick={() => {
                      handlers.handleAcitvePlayerClick(i);
                    }}
                  >
                    {`Player ${i + 1}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-neutral-100/70 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Session
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-2xl cursor-pointer border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                  settings.isGamePaused
                    ? 'border-amber-700 bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-[0_8px_20px_rgba(217,119,6,0.35)]'
                    : 'border-neutral-200 bg-white/80 text-neutral-700 hover:border-neutral-300 hover:bg-white'
                }`}
                onClick={() => {
                  handlers.handleGamePause();
                }}
              >
                Pause
              </button>

              <button
                type="button"
                className="rounded-2xl border cursor-pointer border-neutral-200 bg-white/80 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-all duration-200 hover:border-neutral-300 hover:bg-white"
                onClick={() => {
                  handlers.handleNewGame();
                }}
              >
                New Game
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-neutral-100/70 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Storage
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-2xl border cursor-pointer border-neutral-200 bg-white/80 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-all duration-200 hover:border-neutral-300 hover:bg-white"
                onClick={() => {
                  handlers.handleGameSave();
                }}
              >
                Save Game
              </button>

              <button
                type="button"
                className="rounded-2xl border cursor-pointer border-neutral-200 bg-white/80 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-all duration-200 hover:border-neutral-300 hover:bg-white"
                onClick={() => {
                  handlers.handleGameLoad();
                }}
              >
                Load Game
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-neutral-100/70 p-4 min-w-[180px] shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Statistics
            </span>
            <span className=" block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-800">{`Lines: ${totalLines}`}</span>
            <span className=" block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-800">{`level: ${level}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPanel;
