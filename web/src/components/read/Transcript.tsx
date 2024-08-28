"use client";

import { useContext, useEffect, useState } from "react";

import {
  isOpenTranslationAtom,
  curAudioIdAtom,
  curSentenceIdAtom,
  curTargetLangAtom,
  AudioContext,
  sentencesAtom,
} from "@/store";

import "./Transcript.css";
import { getTokenize } from "@/utils/api";
import { handleRespWithNotifySuccess } from "@/utils/handle_resp";
import type { Sent, Tokens, TokenResp, Token } from "@/types";

import { useAtom, useAtomValue } from "jotai";
import { SentenceButton } from "./Sentence";
import { db } from "@/store/db";

import { SoundSpriteDefinitions } from "howler";

import demoSubtitles from "@/assets/spirited_away_jp_cn.json";
import { AudioPlayer } from "@/lib/audio";
// const demoUrl = "http://pp:5266/assets/spirited_away_jp.mp3";
const demoUrl = "https://lang.majutsushi.world/assets/spirited_away_jp.mp3";

export const Transcript = () => {
  const { state, dispatch, player, setPlayer } = useContext(AudioContext)!;

  const curTargetLang = useAtomValue(curTargetLangAtom);
  const [curSentenceId, setCurSentenceId] = useAtom(curSentenceIdAtom);
  const [sentences, setSentences] = useAtom(sentencesAtom);
  const [curAudioId, setCurAudioId] = useAtom(curAudioIdAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveToDB = async (data: Sent[]) => {
    console.log("save sents:", data.length);
    await db.sents.bulkPut(data);
  };

  useEffect(() => {
    if (!isLoaded) return;

    var newPlayer = new AudioPlayer({
      url: demoUrl,
      debug: true,
      dispatch: dispatch,
    });
    setPlayer(newPlayer);
  }, [curAudioId, dispatch, isLoaded]);

  // initial demo data if failed to load from db
  useEffect(() => {
    db.sents
      .toArray()
      .then((sentsInDB) => {
        if (sentsInDB && sentsInDB.length > 0) {
          console.log("found cache for audio id ", curAudioId);
          setSentences(sentsInDB);
        } else {
          console.log("get audio text from remote", curAudioId);
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
          setSentences(sentencesInitData);
          // save to db
          saveToDB(sentencesInitData);
        }
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load sentences from DB:", error);
      });
  }, [curAudioId]);

  // 更新当前句子
  useEffect(() => {
    let index = 0;
    sentences.forEach((line) => {
      if (line.end < state.seek) {
        index = line.id;
      } else {
        return;
      }
    });
    setCurSentenceId(index - 1 < 0 ? 0 : index - 1);
  }, [state.seek, sentences, setCurSentenceId]);

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
      const sentenceId2Index: { [key: number]: number } = {};
      sentences.forEach((s, i) => {
        sentenceId2Index[s.id] = i;
      });

      console.log("start tokenizing ...", curTargetLang, sents.length);
      for (let i = 0; i < sents.length; i += batch) {
        const texts: string[] = [];
        const sentIndexes: number[] = [];
        for (let j = 0; j < batch; j++) {
          if (i + j >= sents.length) {
            break;
          }
          if (!sents[i + j].isTokenized) {
            texts.push(sents[i + j].text);
            sentIndexes.push(sentenceId2Index[sents[i + j].id]);
          }
        }

        const resp = await getTokenize(curTargetLang, texts);
        handleRespWithNotifySuccess<Tokens>(resp, (data) => {
          for (let i = 0; i < sentIndexes.length; i++) {
            sentences[sentIndexes[i]].tokens = data[i];
            sentences[sentIndexes[i]].isTokenized = true;
          }
          setSentences([...sentences]);
          saveToDB(sentences);
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
