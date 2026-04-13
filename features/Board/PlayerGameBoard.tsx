import React from 'react';
import { ModelObject } from '../hooks/useGameLogic';
import { RenderNextPieceBoard } from '../nextPiece/RenderNextPiece';
import RenderBoard from '../nextPiece/RenderBoard';

interface PlayerGameBoardProps {
  data: ModelObject;
  settings: {
    activePlayers: boolean[];
    isGamePaused: boolean;
  };
}

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <div className="rounded-2xl border border-neutral-300/80 bg-white/70 backdrop-blur-sm px-4 py-3 shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-neutral-700">
        {value}
      </div>
    </div>
  );
};

const PlayerGameBoard = ({ data, settings }: PlayerGameBoardProps) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-125 self-center  rounded-3xl border border-neutral-300 bg-white/40 p-3 shadow-sm backdrop-blur-sm grid grid-cols-[2fr_1fr] gap-3">
        <div className="w-full rounded-2xl border border-neutral-400/70 bg-neutral-50 aspect-[10/20] shadow-inner">
          {data?.board && (
            <RenderBoard
              BoardState={data.board}
              currentPiece={data?.currentPiece}
              isDisabled={data?.isGameEnded || settings.isGamePaused}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-neutral-300 bg-gradient-to-br from-white to-neutral-100 p-3 shadow-sm min-h-[220px] flex items-center justify-center">
            <RenderNextPieceBoard type={data?.nextPiece} />
          </div>

          <StatCard label="Score" value={data?.score ?? 0} />
          <StatCard label="Lines" value={data?.lines ?? 0} />
        </div>
      </div>
    </div>
  );
};

export default PlayerGameBoard;
