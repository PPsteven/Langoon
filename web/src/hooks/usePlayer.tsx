import { useEffect, useRef, useState } from "react";
import { HowlOptions } from "howler";
import { addHowlListener } from "@/utils";

export interface PlayerProps {
  urls: string[];
  volume?: number;
  rate?: number;
}

export type State = {
  seek: number; // 当前播放位置
  duration: number; // 播放总时长
  percent: number; // 播放进度百分比
  status: "play" | "pause" | "loading"; // 播放状态
  err?: string; // 错误信息
};

export default function usePlayer(
  urls: string | string[],
  sprite?: HowlOptions["sprite"]
) {
  const [state, setState] = useState<State>({
    seek: 0,
    duration: 0,
    percent: 0,
    status: "loading",
    err: "",
  });
  const soundRef = useRef<Howl | undefined>(undefined);
  const intervalRef = useRef<number>(0);

  const resetInterval = () => {
    stopInterval();
    intervalRef.current = window.setInterval(() => {
      const seek = soundRef.current?.seek() || 0;
      const percent = (seek / soundRef.current!.duration()) * 100 || 0;
      setState((prev) => ({ ...prev, seek: seek, percent: percent }));
    }, 200);
  };

  const stopInterval = () => {
    intervalRef.current && clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: urls,
        sprite: sprite,
        html5: true,
        preload: true, // Donwload file to improve performance true
      });
    }

    const unListens: Array<() => void> = [];

    unListens.push(
      addHowlListener(soundRef.current, "play", () => {
        console.log("play");
        resetInterval();
        setState((state) => ({
          ...state,
          status: "play",
          err: undefined,
          duration: soundRef.current!.duration(),
        }));
      })
    );
    unListens.push(
      addHowlListener(soundRef.current, "pause", () => {
        console.log("pause");
        clearInterval(intervalRef.current);
        setState((state) => ({ ...state, status: "pause" }));
      })
    );
    unListens.push(
      addHowlListener(soundRef.current, "seek", () => {
        console.log("seek");
        resetInterval();
      })
    );
    unListens.push(
      addHowlListener(soundRef.current, "load", () => {
        console.log("load");
      })
    );
    unListens.push(
      addHowlListener(soundRef.current, "loaderror", () => {
        console.log("load error");
        setState((state) => ({ ...state, status: "pause", err: "Load error" }));
      })
    );
    unListens.push(
      addHowlListener(soundRef.current, "playerror", () => {
        console.log("play error");
        setState((state) => ({ ...state, status: "pause", err: "Play error" }));
      })
    );

    return () => {
      setState((state) => ({ ...state, status: "pause" }));
      unListens.forEach((unListen) => unListen());
      soundRef.current!.unload();
    };
  }, [urls]);

  const seek = (seek: number) => {
    stopInterval();
    soundRef.current!.seek(seek);
  };

  return { sound: soundRef.current!, seek, exposedData: state };
}
