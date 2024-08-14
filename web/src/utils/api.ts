import { TokenResp, TranslateResp, WordDictResp } from "@/types/nlp";

import { r } from "@/utils/requests";

export const getTokenize = (
  langCode: string,
  texts: string[]
): Promise<TokenResp> => {
  return r.post("/nlp/tokenize", {
    source_lang_code: langCode,
    text: texts,
  });
};

export const getTranlation = (texts: string[]): Promise<TranslateResp> => {
  return r.post("/translate", {
    source_lang_code: "ja",
    target_lang_code: "zh-CN",
    texts: texts,
  });
};

export const getWord = (
  word: string,
  sentence: string
): Promise<WordDictResp> => {
  return r.post("/word/" + word, {
    source_lang_code: "jp",
    target_lang_code: "zh-CN",
    sentence: sentence,
  });
};
