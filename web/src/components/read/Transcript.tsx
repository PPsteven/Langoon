"use client";

import { useContext, useEffect, useState } from "react";

import {
  isOpenTranslationAtom,
  curAudioIdAtom,
  curSentenceIdAtom,
  curTargetLangAtom,
  PlayerContext,
  sentencesAtom,
} from "@/store";

import "./Transcript.css";
import { getTokenize } from "@/utils/api";
import { handleRespWithNotifySuccess } from "@/utils/handle_resp";
import type { Sent, Tokens, TokenResp, Token } from "@/types/nlp";

import { useAtom, useAtomValue } from "jotai";
import { SentenceButton } from "./Sentence";
import { db } from "@/store/db";
import { useLiveQuery } from "dexie-react-hooks";

import demoSubtitles from "@/assets/spirited_away_jp_cn.json";

export const Transcript = () => {
  const { exposedData: progress } = useContext(PlayerContext);

  const curTargetLang = useAtomValue(curTargetLangAtom);
  const [curSentenceId, setCurSentenceId] = useAtom(curSentenceIdAtom);
  const [sentences, setSentences] = useAtom(sentencesAtom);
  const [curAudioId, setCurAudioId] = useAtom(curAudioIdAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSents = async (data: Sent[]) => {
    console.log("load sents:", data.length);
    await db.sents.bulkPut(data);
  };

  // initial demo data if failed to load from db
  useEffect(() => {
    db.sents
      .toArray()
      .then((sentsInDB) => {
        if (sentsInDB && sentsInDB.length > 0) {
          console.log("Sentences loaded from DB:", sentsInDB);
          setSentences(sentsInDB);
        } else {
          const sentencesInitData = demoSubtitles
            .filter((line) => line.text.trim() !== "")
            .map((line, id) => {
              return {
                ...line,
                text: line.text.trim(),
                id: parseInt(line.id, 10),
                start: line.start,
                end: line.end,
                isSelected: false,
                isTokenized: false,
                tokens: [], // Ensure tokens is an empty array
                translation: line.translation || "",
              } as Sent;
            });
          loadSents(sentencesInitData);
          setSentences(sentencesInitData);
        }
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load sentences from DB:", error);
      });
  }, []);

  // 更新当前句子
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

  // 滚动到当前句子
  useEffect(() => {
    const activeDom = document.querySelector(`.active`);
    if (activeDom) {
      activeDom.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [curSentenceId]);

  // 加载完句子后，开始分词
  useEffect(() => {
    if (!isLoaded) return;

    const handleTokenize = async (sents: Sent[], batch = 100) => {
      console.log("start tokenizing ...", curTargetLang, sents.length);
      for (let i = 0; i < sents.length; i += batch) {
        const texts = sentences.slice(i, i + batch).map((s) => s.text);
        const resp = await getTokenize(curTargetLang, texts);
        handleRespWithNotifySuccess<Tokens>(resp, (data) => {
          for (let j = 0; j < texts.length; j++) {
            sentences[i + j].tokens = data[j];
          }
          setSentences([...sentences]);
          loadSents(sentences);
        });
      }
      console.log("end tokenizing");
    };

    db.sents
      .filter((s) => !s.isTokenized)
      .toArray()
      .then((sents) => {
        if (sents.length > 0) {
          handleTokenize(sents);
        }
      });
  }, [isLoaded, curTargetLang]);

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
