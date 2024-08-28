import { Resp } from "./resp";

export interface Token {
  text: string;
  // TODO: add more "AUX"  | "SCONJ" | "INTJ"| "SYM" | "X";} ;
  pos:
    | "PROPN"
    | "AUX"
    | "SCONJ"
    | "NOUN"
    | "SPACE"
    | "VERB"
    | "ADJ"
    | "ADV"
    | "PART"
    | "NUM"
    | "PUNCT"
    | "CCONJ";
  whitespace: string;
  meaning?: string;
}

export type Tokens = Token[][];

export type TokenResp = Resp<Tokens>;

export interface Sent {
  id: number;
  text: string;
  translation: string;
  isSelected: boolean;
  start: number;
  end: number;
  isTokenized: boolean;
  tokens?: Token[];
}

export interface WordDict {
  pron: string;
  original: string;
  meaning: string;
  definition: string;
  explain: string;
  examples: string[];
  others: string[];
  class: string;
}

export type WordDictResp = Resp<WordDict>;

export interface Translate {
  texts: string[];
}

export type TranslateResp = Resp<Translate>;
