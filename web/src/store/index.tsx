"use client";

import { createContext, useState } from "react";
import type { Sent } from "@/types";
import type { AudioState, AudioOptions } from "@/lib/audio";
import { AudioPlayer } from "@/lib/audio";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { useImmerReducer } from "use-immer";

// audio
export type AudioAction =
  | { type: "load"; payload: { duration: number } }
  | { type: "play" }
  | { type: "pause" }
  | { type: "next" }
  | { type: "pre" }
  | { type: "seek"; payload: number };

export type Dispatch = (action: AudioAction) => void;

export const AudioContext = createContext<{
  state: AudioState;
  dispatch: Dispatch;
  player: AudioPlayer | null;
  setPlayer: (player: AudioPlayer) => void;
} | null>(null);

export const AudioReducer = (draft: AudioState, action: AudioAction) => {
  switch (action.type) {
    case "load":
      draft.duration = action.payload.duration;
      draft.status = "pause";
      break;
    case "play":
      draft.status = "play";
      break;
    case "pause":
      draft.status = "pause";
      break;
    case "seek":
      draft.status = "play";
      draft.seek = action.payload;
      draft.percent = draft.percent / draft.duration;
      break;
  }
};

export const AudioContextProvider = (props: any) => {
  const { children = null } = props;
  const [state, dispatch] = useImmerReducer(AudioReducer, {
    seek: 0,
    duration: 0,
    percent: 0,
    status: "loading",
  } as AudioState);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);

  return (
    <AudioContext.Provider value={{ state, dispatch, player, setPlayer }}>
      {children}
    </AudioContext.Provider>
  );
};

// config
export const isOpenTranslationAtom = atomWithStorage("isOpenTranslation", true);
export const curTargetLangAtom = atomWithStorage("curTargetLang", "jp");
export const curAudioIdAtom = atomWithStorage("curAudioId", 1);
export const sentencesAtom = atom<Sent[]>([]);
export const curSentenceIdAtom = atom(-1);
