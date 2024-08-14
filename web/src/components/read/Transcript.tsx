"use client";

import { useContext, useEffect } from "react";

import {
  isOpenTranslationAtom,
  curSentenceIdAtom,
  curTargetLangAtom,
  sentencesInit,
  PlayerContext,
  sentencesAtom,
} from "@/store";

import "./Transcript.css";
import { getTokenize } from "@/utils/api";
import { handleRespWithNotifySuccess } from "@/utils/handle_resp";
import type { Sent, Token } from "@/types/nlp";

import { useAtom, useAtomValue } from "jotai";
import { SentenceButton } from "./Sentence";

export const Transcript = () => {
  const { exposedData: progress } = useContext(PlayerContext);

  const curTargetLang = useAtomValue(curTargetLangAtom);
  const [curSentenceId, setCurSentenceId] = useAtom(curSentenceIdAtom);
  const [sentences, setSentences] = useAtom(sentencesAtom);

  useEffect(() => {
    let index = 0;
    sentences.forEach((line) => {
      if (line.end < progress.seek) {
        index = line.id;
      } else {
        return;
      }
    });
    setCurSentenceId(index - 1 < 0 ? 0 : index - 1);
  }, [progress.seek, sentences, setCurSentenceId]);

  useEffect(() => {
    const activeDom = document.querySelector(`.active`);
    if (activeDom) {
      activeDom.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [curSentenceId]);

  useEffect(() => {
    const batch = 50;

    const handleTokenize = async () => {
      for (let i = 0; i < sentences.length; i += batch) {
        const texts = sentences.slice(i, i + batch).map((s) => s.text);
        const resp = await getTokenize(curTargetLang, texts);
        handleRespWithNotifySuccess(resp, (data) => {
          for (let j = 0; j < texts.length; j++) {
            sentences[i + j].tokens = data[j];
          }
          setSentences(sentences);
        });
      }
    };

    handleTokenize();
  }, [curTargetLang]);

  return (
    <div className="h-full py-4">
      <div className="flex flex-col gap-1 h-full overflow-y-auto">
        {sentences.map((item, i) => (
          <SentenceButton
            key={item.id}
            data={item as Sent}
            isActive={curSentenceId == i}
          />
        ))}
      </div>
    </div>
  );
};

export default Transcript;
