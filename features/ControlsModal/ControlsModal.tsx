import React from 'react';
import {
  Controls,
  keyListeningType,
  ModelObject,
  PlayerIndex,
  SettingsType,
} from '../hooks/useGameLogic';
interface ControlsModalProps {
  startKeyBinding: (playerID: PlayerIndex, position: keyof Controls) => void;
  keyListening: keyListeningType;
  handleModalClose: () => void;
  model: (ModelObject | null)[];
  settings: SettingsType;
  gameToast: string;
}

export const CloseIcon = ({
  className = 'w-5',
  color,
}: {
  className: string;
  color: string;
}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <g stroke={color} strokeWidth={1.5}>
      <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
      <path strokeLinecap="round" d="m14.5 9.5-5 5m0-5 5 5" />
    </g>
  </svg>
);

export const ControlsModal = ({
  handleModalClose,
  startKeyBinding,
  keyListening,
  model,
  settings,
  gameToast,
}: ControlsModalProps) => {
  return (
    <div className="fixed inset-0 z-20 w-full overflow-y-auto bg-neutral-100/95 px-4 py-6 backdrop-blur-xl sm:py-8">
      <button
        type="button"
        className="fixed right-4 top-4 z-30 cursor-pointer rounded-xl border border-black/10 bg-white/80 p-1.5 shadow-sm backdrop-blur-md transition hover:scale-105 hover:opacity-80 focus:outline-none focus:ring-0"
        onClick={handleModalClose}
      >
        <CloseIcon className="w-7" color="#212121" />
      </button>

      <div className="mx-auto flex min-h-full w-full max-w-[1100px] flex-col items-center justify-start pt-8 sm:pt-10 lg:justify-center">
        <div className="mb-6 text-center sm:mb-8">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.35em] text-amber-600 sm:text-[11px]">
            Game Settings
          </span>

          <h2 className="text-[24px] font-black uppercase tracking-[0.24em] text-neutral-700 sm:text-[28px] md:text-[34px]">
            Controls
          </h2>

          <div className="mx-auto mt-3 h-[2px] w-[72px] rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>

        <div className="grid w-full max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {settings?.controls &&
            Object.entries(settings.controls).map(([playerID, controls]) => (
              <div
                className="rounded-[24px] border border-black/10 bg-white/80 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-5"
                key={playerID}
              >
                <span className="mb-4 block text-center text-[14px] font-black uppercase tracking-[0.26em] text-neutral-700 sm:mb-5 sm:text-[15px]">
                  {`Player ${playerID}`}
                </span>

                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {Object.entries(controls).map(
                    ([position, positonObj], kix) => {
                      const isActive =
                        keyListening.playerID === Number(playerID) &&
                        keyListening.position === position;

                      return (
                        <div
                          key={kix}
                          className="flex flex-row items-center justify-between gap-3"
                        >
                          <span className="text-[13px] font-semibold text-neutral-600">
                            {position}
                          </span>

                          <button
                            type="button"
                            className={`min-w-[54px] rounded-2xl border px-4 py-2 text-[13px] font-bold uppercase shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 active:scale-95 ${
                              isActive
                                ? 'border-blue-700 bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)]'
                                : 'border-amber-700 bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-[0_10px_25px_rgba(217,119,6,0.35)] hover:scale-105 hover:shadow-[0_14px_30px_rgba(217,119,6,0.42)]'
                            }`}
                            onClick={() => {
                              startKeyBinding(
                                Number(playerID) as PlayerIndex,
                                position as keyof Controls,
                              );
                            }}
                          >
                            {positonObj?.label}
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
        </div>

        <span className="mt-5 flex min-h-[32px] items-center justify-center text-center text-[15px] font-semibold text-neutral-700">
          {gameToast}
        </span>

        <div className="mb-4 mt-3 flex items-center justify-center gap-4 rounded-[22px] border border-black/10 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-md">
          <span className="text-[14px] font-semibold text-neutral-600">
            Pause / Unpause
          </span>

          <button
            type="button"
            disabled
            className="rounded-2xl border border-amber-700 bg-gradient-to-b from-amber-400 to-amber-600 px-4 py-2 text-[13px] font-bold text-white shadow-[0_10px_25px_rgba(217,119,6,0.3)]"
          >
            P
          </button>
        </div>
      </div>
    </div>
  );
};
