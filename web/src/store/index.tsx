"use client";

import { createContext, useState } from "react";
import type { State } from "@/hooks/usePlayer";
import type { Sent } from "@/types/nlp";
import usePlayer from "@/hooks/usePlayer";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const PlayerContext = createContext<{
  sound: Howl;
  seek: (seek: number, id?: number) => void;
  exposedData: State;
  searchWord: string;
  setSearchWord: (value: string) => void;
  searchSent: string;
  setSearchSent: (value: string) => void;
}>({} as any);

const urls = ["http://pp:5266/assets/spirited_away_jp.mp3"];

export const PlayerContextProvider = (props: any) => {
  // 当前句子列表
  const [sentences, setSentences] = useState<Sent[]>([]);
  // 当前搜索的单词
  const [searchWord, setSearchWord] = useState("");
  // 当前搜索的句子
  const [searchSent, setSearchSent] = useState("");

  const { children = null } = props;
  const { sound, seek, exposedData } = usePlayer(urls);

  return (
    <PlayerContext.Provider
      value={{
        sound: sound,
        seek: seek,
        exposedData: exposedData,
        searchWord,
        setSearchWord,
        searchSent,
        setSearchSent,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const isOpenTranslationAtom = atomWithStorage("isOpenTranslation", true);
export const curTargetLangAtom = atomWithStorage("curTargetLang", "jp");
export const curAudioIdAtom = atomWithStorage("curAudioId", 1);

export const sentencesAtom = atom<Sent[]>([]);

export const curSentenceIdAtom = atom(-1);
