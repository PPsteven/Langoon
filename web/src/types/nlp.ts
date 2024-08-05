import { Resp } from "./resp";

export interface Token {
    text: string;
    // TODO: add more "AUX"  | "SCONJ" | "INTJ"| "SYM" | "X";} ;
    pos:  "PROPN" | "NOUN" | "VERB" | "ADJ" | "ADV" | "PART" | "NUM"| "PUNCT"| "CCONJ"; 
    whitespace: string;
}

export function isWord(token: Token): boolean {
   if (token.pos === "PUNCT" ||
       token.pos === "PART" || 
       token.pos === "NUM") {
        return false;
   }
   return true;
}

export type Tokens = Token[][];

export type TokenResp = Resp<Tokens>;

export interface Sentence {
    id: number;
    text: string;
    translation: string;
    isSelected: boolean;
    start: number;
    end: number;
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