import {
  PlayIcon as PlayIcon,
  PauseIcon as PauseIcon,
  UndoDotIcon as BackwardIcon,
  RedoDotIcon as ForwardIcon,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { formatTime } from "../../utils/helper";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { curSentenceIdAtom, PlayerContext, sentencesAtom } from "@/store";
import { useAtom, useAtomValue } from "jotai";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "net";

const Buttons = () => {
  const { sound: player, exposedData: state } = useContext(PlayerContext)!;

  const [curSentenceId] = useAtom(curSentenceIdAtom);
  const sentences = useAtomValue(sentencesAtom);

  const playMedia = () => {
    if (state.status === "play") {
      player.pause();
    } else if (state.status === "pause") {
      player.play();
    }
  };

  const switchNextSentence = (pre = false) => {
    let curIndex = pre ? curSentenceId - 1 : curSentenceId + 1;
    if (curIndex < 0) {
      curIndex = 0;
    }
    if (curIndex >= sentences.length) {
      curIndex = sentences.length - 1;
    }
    player.seek(sentences[curIndex].start);
  };

  return (
    <div className="flex justify-center gap-1 w-[140px] p-1 border-2 rounded-xl">
      <Button size="icon" onClick={() => switchNextSentence(true)}>
        <BackwardIcon size={24} />
      </Button>
      <Button size="icon" onClick={playMedia}>
        {state.status == "play" ? (
          <PauseIcon size={32} />
        ) : (
          <PlayIcon size={32} />
        )}
      </Button>
      <Button size="icon" onClick={() => switchNextSentence()}>
        <ForwardIcon size={24} />
      </Button>
    </div>
  );
};

const ProgressBar = () => {
  const { sound, seek, exposedData: state } = useContext(PlayerContext)!;

  const onChange = (val: number) => {
    seek((val / 100) * state.duration);
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
    <div className="w-full h-full cursor-pointer flex gap-4 items-center">
      <span>{formatTime(state.seek)}</span>
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
          setTimeout(() => {
            setIsDragging(false);
          }, 200);
        }}
      />
      <span>{formatTime(state.duration)}</span>
    </div>
  );
};

export const Control = () => {
  return (
    <div className="flex flex-col items-center">
      <ProgressBar />
      <Buttons />
    </div>
  );
};

export default Control;