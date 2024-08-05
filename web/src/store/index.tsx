import { createContext, useState } from "react";
import type { State } from "@/hooks/usePlayer";
import type { Sentence } from "@/types/nlp";
import usePlayer from "@/hooks/usePlayer";

export const PlayerContext = createContext<{
  sound: Howl;
  exposedData: State;
  sentences: Sentence[];
  setSentences: (value: Sentence[]) => void;
  curSentenceId: number;
  setCurSentenceId: (value: number) => void;
  searchWord: string;
  setSearchWord: (value: string) => void;
  searchSent: string;
  setSearchSent: (value: string) => void;
}>({} as any);

const urls = ["https://lang.majutsushi.world/assets/spirited_away_jp.mp3"];

export const PlayerContextProvider = (props: any) => {
  // 当前句子列表
  const [sentences, setSentences] = useState<Sentence[]>([]);
  // 当前播放的句子 id
  const [curSentenceId, setCurSentenceId] = useState(-1);
  // 当前搜索的单词
  const [searchWord, setSearchWord] = useState("");
  // 当前搜索的句子
  const [searchSent, setSearchSent] = useState("");

  const { children = null } = props;
  const { sound, exposedData } = usePlayer(urls);

  return (
    <PlayerContext.Provider
      value={{
        sound: sound,
        exposedData: exposedData,
        sentences,
        setSentences,
        curSentenceId,
        setCurSentenceId,
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
