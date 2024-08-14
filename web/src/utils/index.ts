import { Token } from "@/types/nlp";

export function addHowlListener(howl: Howl, ...args: Parameters<Howl["on"]>) {
  howl.on(...args);

  return () => howl.off(...args);
}

export function isWord(token: Token): boolean {
  if (
    token.pos === "PUNCT" ||
    token.pos === "PART" ||
    token.pos === "NUM" ||
    token.pos == "SPACE"
  ) {
    return false;
  }
  return true;
}