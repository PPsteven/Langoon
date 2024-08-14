import { curSentenceIdAtom, sentencesAtom } from "@/store";
import { useAtom } from "jotai";
import { Sentence } from "../Sentence";

const SentencePanel = () => {
  const [curSentenceId, setCurSentenceId] = useAtom(curSentenceIdAtom);
  const [sentences, setSentences] = useAtom(sentencesAtom);

  if (sentences.length === 0 || curSentenceId === -1) {
    return <div className="div">Loading...</div>;
  }

  return (
    <div className="container flex items-center justify-center">
      <Sentence
        key={sentences[curSentenceId].id}
        data={sentences[curSentenceId]}
        isHuge={true}
      />
    </div>
  );
};

export default SentencePanel;
