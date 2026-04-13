'use client';

import PlayerGameBoard from '@/features/Board/PlayerGameBoard';
import TopPanel from '@/features/Board/TopPanel';
import { ModelObject, useGameLogic } from '@/features/hooks/useGameLogic';

const Home = () => {
  const { model, settings, setSettings, handlers, totalLines, level } =
    useGameLogic();
  const playersCount = settings.activePlayers.filter(
    (element) => element === true,
  ).length;
  console.log(model?.[0]);
  return (
    <div className="flex w-full h-screen overflow-y-auto flex-col bg-gradient-to-r py-4 md:px-16 from-neutral-50 to-neutral-200">
      <TopPanel
        settings={settings}
        setSettings={setSettings}
        handlers={handlers}
        totalLines={totalLines}
        level={level}
      />
      <div
        className="relative mt-2 rounded-2xl h-full bg-neutral-100 p-2 gap-4 grid items-center"
        style={{
          gridTemplateColumns: `repeat(${playersCount}, minmax(0, 1fr))`,
        }}
      >
        {settings.isGamePaused && (
          <div className="w-full z-20  absolute animate-fade left-0 top-[50%] translate-y-[-50%] animate-fade shadow-lg  bg-gradient-to-br from-white/90 to-neutral-100/50 h-[100px] text-4xl font-semibold uppercase tracking-[0.2em] text-neutral-500  flex items-center justify-center">
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
    </div>
  );
};
export default Home;
