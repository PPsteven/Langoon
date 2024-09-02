import Dexie, { type EntityTable } from "dexie";
import { Sent, Word } from "@/types";

const db = new Dexie("audio") as Dexie & {
  sents: EntityTable<
    Sent,
    "id" // primary key "id" (for the typings only)
  >;

  words: EntityTable<Word, "id">;
};

// Schema declaration:
db.version(1).stores({
  sents: "id", // primary key "id" (for the runtime!)
  words: "id, text, [audioId+sentenceId]",
});

export { db };
