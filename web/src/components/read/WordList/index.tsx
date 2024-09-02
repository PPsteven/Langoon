"use client";

import { curSentenceIdAtom, sentencesAtom } from "@/store";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Volume2 } from "lucide-react";
import usePronunciationSound from "@/hooks/usePronunciation";
import { Token, Word } from "@/types";
import { handleRespWithNotifySuccess } from "@/utils/handle_resp";
import { getTranlation } from "@/utils/api";
import { isWord } from "@/utils";
import { db } from "@/store/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  const elems = Array.from(
    { length: 10 },
    () => Math.floor(Math.random() * (300 - 100 + 1)) + 100
  );
  return (
    <div className="flex flex-wrap gap-4">
      <Skeleton className="h-10 w-[200px] rounded-xl" />
      <Skeleton className="h-10 w-[100px] rounded-xl" />
      <Skeleton className="h-10 w-[150px] rounded-xl" />
      <Skeleton className="h-10 w-[300px] rounded-xl" />
      <Skeleton className="h-10 w-[100px] rounded-xl" />
      <Skeleton className="h-10 w-[120px] rounded-xl" />
      <Skeleton className="h-10 w-[120px] rounded-xl" />
      <Skeleton className="h-10 w-[150px] rounded-xl" />
    </div>
  );
}

interface WordCardProps {
  word: Word;
}

export const WordCard = ({ word }: WordCardProps) => {
  const { play, stop } = usePronunciationSound(word.text, false);

  const playWord = () => {
    stop();
    play();
  };

  return (
    <div className="grow max-w-[350px] p-2 bg-gray-200 rounded-md">
      <div className="flex gap-2 items-center">
        <Button size={"icon"} className="h-6 w-6" onClick={playWord}>
          <Volume2 />
        </Button>
        <span className="text-md font-bold">{word.text}</span>
        <span className="text-xs">{word.pos}</span>
        <span className="text-md ml-1">{word.meaning}</span>
      </div>
    </div>
  );
};

interface WordListProps {
  words: Token[];
}

const getAudioIdFromWordId = (words: Token[]) => {
  if (!words || words.length === 0) return [-1, -1];
  const [aid, sid, _] = words[0].id.split("_");
  return [parseInt(aid), parseInt(sid)];
};

export const WordList = ({ words }: WordListProps) => {
  const [audioId, sentenceId] = getAudioIdFromWordId(words);
  const wordsCache = useLiveQuery(async () => {
    const words = await db.words.where({ audioId, sentenceId }).toArray();
    return words;
  }, [audioId, sentenceId]);
  const [wordsData, setWordsData] = useState<Word[]>([]);

  const saveWordsToDb = async (words: Word[]) => {
    console.log("save words:", words.length);
    await db.words.bulkPut(words);
  };

  useEffect(() => {
    if (wordsCache) {
      setWordsData(wordsCache);
    }
  }, [wordsCache]);

  // 查询单词
  useEffect(() => {
    // 命中缓存
    if (wordsCache && wordsCache.length > 0) return;

    const queryWords = words.filter((word) => {
      return isWord(word);
    });

    // 进一步获取单词的翻译
    const handleTranslate = async () => {
      const texts = queryWords.map((word) => word.text);
      const resp = await getTranlation(texts);

      // translate
      handleRespWithNotifySuccess(resp, (data) => {
        const words = data.texts.map((text, i) => {
          const [audioId, sentenceId, _] = queryWords[i].id.split("_");
          return {
            ...queryWords[i],
            audioId: parseInt(audioId),
            sentenceId: parseInt(sentenceId),
            meaning: text,
          } as Word;
        });
        saveWordsToDb(words);
        setWordsData(words);
      });
    };

    handleTranslate();
  }, [audioId, sentenceId, wordsCache]);

  return wordsData.length > 0 ? (
    <div className="flex flex-wrap gap-3 box-border">
      {wordsData.map((word, idx) => (
        <WordCard key={idx} word={word} />
      ))}
    </div>
  ) : (
    <SkeletonCard />
  );
};
