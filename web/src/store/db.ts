import Dexie, { type EntityTable } from "dexie";
import { Sent } from "@/types";

const db = new Dexie("audio") as Dexie & {
  sents: EntityTable<
    Sent,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  sents: "id", // primary key "id" (for the runtime!)
});

export { db };
