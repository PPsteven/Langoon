import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/16/solid';

import { Slider } from "@/components/ui/slider";
import { formatTime } from "../../utils/helper";
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "@/store";

const Buttons = () => {
  const { sound: player, exposedData: state, sentences, curSentenceId } = useContext(PlayerContext)!;

  const playMedia = () => {
    if (state.status === "play") {
      player.pause();
    } else if (state.status === "pause") {
      player.play();
    }
  }

  const switchNextSentence = (pre = false) => {
    const curIndex = pre ? curSentenceId - 1 : curSentenceId + 1;
    player.seek(sentences[curIndex].start)
  }

  return (
    <div className="flex justify-center gap-4">
      <button onClick={()=>switchNextSentence(true)}>
        <BackwardIcon className="h-6 w-6 text-gray-500" />
      </button>
      <button
        className="btn btn-circle btn-ghost shadow-xl"
        onClick={playMedia}
      >
        {state.status == "play" ? (
          <PauseIcon className='h-6 w-6'/>
        ) : (
          <PlayIcon className='h-6 w-6'/>
        )}
      </button>
      <button onClick={()=>switchNextSentence()}>
        <ForwardIcon className="h-6 w-6 text-gray-500" />
      </button>
    </div>
  );
};

const ProgressBar = () => {
  const { sound, exposedData: state } = useContext(PlayerContext)!;

  const onChange = (val: number) => {
    sound.seek((val / 100) * state.duration);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isDragging) return;
    setValue((state.seek / state.duration) * 100);
    // 注意: 这里不能添加 isDragging 依赖, 不然进度条在isDragging变动的时候会发生突然的跳变。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.seek, state.duration]);

  return (
    <div className="w-full h-full cursor-pointer">
      <div className="w-full absolute left-0 -top-8 ">
        <div className="text-left flex justify-between">
          <span>{formatTime(state.seek)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>
      <Slider
        className="h-full"
        value={[value]}
        max={100}
        step={1}
        onValueChange={(e) => {
          setValue(e[0]);
          setIsDragging(true);
        }}
        onValueCommit={(e) => {
          onChange(e[0]);
          setIsDragging(false);
        }}
      />
    </div>
  );
};

export const Control = () => {
  return (
    <div className="w-full h-16 sticky left-0 bottom-0 bg-orange-100">
      <div className="relative">
        <div className="absolute left-0 -top-2 w-full h-4">
          <ProgressBar />
        </div>
      </div>
      <div className="h-full my-3">
        <Buttons />
      </div>
    </div>
  );
};
