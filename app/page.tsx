'use client';

import PlayerGameBoard from '@/features/Board/PlayerGameBoard';
import TopPanel from '@/features/Board/TopPanel';
import { ControlsModal } from '@/features/ControlsModal/ControlsModal';
import { ModelObject, useGameLogic } from '@/features/hooks/useGameLogic';

const Home = () => {
  const {
    model,
    settings,
    setSettings,
    handlers,
    totalLines,
    level,
    isControlModalOpen,
    keyListening,
    gameToast,
  } = useGameLogic();

  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-auto bg-[radial-gradient(circle_at_center,_#fafafa_0%,_#f2f2f2_70%)] py-4 md:px-16">
      <TopPanel
        settings={settings}
        setSettings={setSettings}
        handlers={handlers}
        totalLines={totalLines}
        level={level}
      />

      <div className="relative mt-2 flex flex-1 flex-wrap bg-neutral-100 border border-neutral-200 rounded-2xl px-4 py-6 justify-center gap-6 overflow-x-auto hide-scrollbar shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        {settings.isGamePaused && (
          <div className="absolute left-0 top-[50%] z-20 flex h-[100px] w-full translate-y-[-50%] items-center justify-center bg-gradient-to-br from-white/90 to-neutral-100/50 text-4xl font-semibold uppercase tracking-[0.2em] text-neutral-500 shadow-lg">
            Game Paused
          </div>
        )}

        {settings?.activePlayers?.map((player, index) => {
          if (!player) return null;

          return (
            <PlayerGameBoard
              key={index}
              settings={settings}
              data={model[index] as ModelObject}
            />
          );
        })}
      </div>

      {isControlModalOpen && (
        <ControlsModal
          handleModalClose={handlers.closeControlModal}
          startKeyBinding={handlers.startKeyBinding}
          keyListening={keyListening}
          settings={settings}
          model={model}
          gameToast={gameToast}
        />
      )}
    </div>
  );
};

export default Home;
