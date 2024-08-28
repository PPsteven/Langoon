"use client";

import { curSentenceIdAtom, sentencesAtom } from "@/store";
import { useAtom, useAtomValue } from "jotai";
import { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Volume2 } from "lucide-react";
import usePronunciationSound from "@/hooks/usePronunciation";
import { Token } from "@/types";
import { handleRespWithNotifySuccess } from "@/utils/handle_resp";
import { getTranlation } from "@/utils/api";
import { isWord } from "@/utils";

interface WordCardBriefProps {
  word: Token;
}

export const WordCardBrief = ({ word }: WordCardBriefProps) => {
  const { play, stop } = usePronunciationSound(word.text, false);

  const playWord = () => {
    stop();
    play();
  };

  return (
    <div className="box-content border-2 border-gray-300 mb-[-2px] h-12 p-2">
      <div className="flex items-center">
        <span className="text-md font-bold">{word.text}</span>
        <span className="text-sm text-gray-400 ml-1">{word.pos}</span>
        <span className="text-sm ml-1">{word.meaning}</span>
        <Button size={"icon"} onClick={playWord}>
          <Volume2 />
        </Button>
      </div>
    </div>
  );
};

export const WordList = () => {
  const curSentenceId = useAtomValue(curSentenceIdAtom);
  const [sentences, setSentences] = useAtom(sentencesAtom);

  const [wordList, setWordList] = useState<Token[]>([]);

  useEffect(() => {
    // setWordList(["あの", "巨大", "巨大", "な"]);
    // setWordList([
    //   {
    //     text: "ずうっと",
    //     pos: "ADV",
    //     whitespace: "",
    //   },
    // ] as Token[]);

    if (curSentenceId < 0 || curSentenceId >= sentences.length) return;

    const words = sentences[curSentenceId].tokens;
    if (!words) return;

    setWordList(words.filter((word) => isWord(word)));

    // // 进一步获取单词的翻译
    // const texts = wordList.map((word) => word.text);

    // let newWordList = wordList;

    // const handleTranslate = async () => {
    //   const resp = await getTranlation(texts);

    //   // translate
    //   handleRespWithNotifySuccess(resp, (data) => {
    //     newWordList = wordList.map((line, i) => {
    //       return { ...wordList[i], meaning: data.texts[i] };
    //     });
    //   });
    //   setWordList(newWordList);
    // };

    // handleTranslate();
  }, [curSentenceId]);

  console.log("111111");
  return (
    <div className="w-full h-full flex flex-col box-border">
      {wordList.map((word, idx) => {
        return <WordCardBrief key={idx} word={word} />;
      })}
    </div>
  );
};
