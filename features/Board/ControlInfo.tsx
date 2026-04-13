import React from 'react';

const ArrowIcon = ({
  className = 'w-5',
  color = '#ccc',
  rotation = 0,
}: {
  className?: string;
  color?: string;
  rotation?: number;
}) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    className={className}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path
      fill={color}
      fillRule="evenodd"
      d="M7.768 2.25h8.464c.813 0 1.469 0 2 .043.546.045 1.026.14 1.47.366a3.75 3.75 0 0 1 1.64 1.639c.226.444.32.924.365 1.47.043.531.043 1.187.043 2v8.464c0 .813 0 1.469-.043 2-.045.546-.14 1.026-.366 1.47a3.75 3.75 0 0 1-1.639 1.64c-.444.226-.924.32-1.47.365-.531.043-1.187.043-2 .043H7.768c-.813 0-1.469 0-2-.043-.546-.045-1.026-.14-1.47-.366a3.75 3.75 0 0 1-1.64-1.639c-.226-.444-.32-.924-.365-1.47-.043-.531-.043-1.187-.043-2V7.768c0-.813 0-1.469.043-2 .045-.546.14-1.026.366-1.47a3.75 3.75 0 0 1 1.639-1.64c.444-.226.924-.32 1.47-.365.531-.043 1.187-.043 2-.043zM5.89 3.788c-.454.037-.715.107-.912.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912-.037.462-.038 1.057-.038 1.909v8.4c0 .853 0 1.447.038 1.91.037.453.107.714.207.911.216.424.56.768.984.984.197.1.458.17.912.207.462.037 1.057.038 1.909.038h8.4c.853 0 1.447 0 1.91-.038.453-.038.714-.107.911-.207.424-.216.768-.56.984-.984.1-.197.17-.458.207-.912.037-.462.038-1.057.038-1.909V7.8c0-.852 0-1.447-.038-1.91-.038-.453-.107-.714-.207-.911a2.25 2.25 0 0 0-.984-.984c-.197-.1-.458-.17-.912-.207-.462-.037-1.057-.038-1.909-.038H7.8c-.852 0-1.447 0-1.91.038zm8.987 8.962c-.074.197-.21.42-.48.737-.3.353-.72.774-1.322 1.377L11.47 16.47a.75.75 0 1 0 1.06 1.06l1.606-1.606.023-.022c.575-.575 1.038-1.039 1.383-1.445.355-.418.628-.824.782-1.298a3.75 3.75 0 0 0 0-2.318c-.154-.474-.427-.88-.782-1.298-.345-.406-.808-.87-1.383-1.445l-.023-.022L12.53 6.47a.75.75 0 1 0-1.06 1.06l1.606 1.606c.602.603 1.022 1.024 1.322 1.377.27.318.406.54.48.737H7a.75.75 0 0 0 0 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

const RenderKey = ({
  ckey,
  index,
  reverse = false,
}: {
  ckey: string;
  index: number;
  reverse?: boolean;
}) => {
  return (
    <div
      className={`
        w-fit flex items-center gap-2 px-3 py-1.5
        rounded-xl
        bg-white/70 backdrop-blur-sm
        border border-gray-200/60
        shadow-sm
        hover:shadow-md
        transition-all duration-200
        ${reverse ? 'flex-row-reverse' : ''}
      `}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 shadow-inner">
        <ArrowIcon className="w-4" color="#414141" rotation={0 + 90 * index} />
      </div>

      <span className="text-xs font-medium tracking-wide text-gray-700">
        {ckey}
      </span>
    </div>
  );
};
export const ControlInfo = () => {
  const p2Keys = ['arrowRight', 'arrowDown', 'arrowLeft', 'arrowUp'];
  const p1Keys = ['d key', 's key', 'a key', 'w key'];

  return (
    <div className="w-full flex flex-row justify-between">
      <div>
        {p1Keys.map((key, index) => {
          return <RenderKey key={index} ckey={key} index={index} />;
        })}
      </div>
      <div className=" flex flex-col items-end">
        {p2Keys.map((key, index) => {
          return <RenderKey key={index} ckey={key} index={index} reverse />;
        })}
      </div>
    </div>
  );
};
