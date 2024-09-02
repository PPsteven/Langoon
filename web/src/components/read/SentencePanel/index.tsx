import { curSentenceIdAtom, sentencesAtom } from "@/store";
import { useAtom } from "jotai";
import { Sentence } from "../Sentence";
import { WordList } from "../WordList";

const SentencePanel = () => {
  const [curSentenceId, setCurSentenceId] = useAtom(curSentenceIdAtom);
  const [sentences] = useAtom(sentencesAtom);
  const curSentence = sentences[curSentenceId];

  if (!curSentence) {
    return <div className="div">Loading...</div>;
  }

  console.log("curSentence", curSentence.tokens);
  return (
    <div className="container h-full flex flex-col items-center justify-center">
      <div className="h-2/5 flex items-end">
        <Sentence key={curSentence.id} data={curSentence} isHuge={true} />
      </div>
      <div className="h-3/5 pt-10 w-[80%]">
        {curSentence.tokens && <WordList words={curSentence.tokens!} />}
      </div>
    </div>
  );
};

export default SentencePanel;
