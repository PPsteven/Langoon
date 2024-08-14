import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  curSentenceIdAtom,
  isOpenTranslationAtom,
  PlayerContext,
} from "@/store";
import { Sent, Token } from "@/types/nlp";
import { isWord } from "@/utils";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { MoreVertical } from "lucide-react";
import { useContext } from "react";



interface WordProps {
  token: Token;
}

const Word = ({ token }: WordProps) => {
  return (
    <div className="font-sans">
      {isWord(token) ? (
        <button>
          <span
            className={classNames(
              "box-border border border-transparent rounded cursor-pointer",
              "hover:bg-orange-300"
            )}
          >
            {token.text}
          </span>
        </button>
      ) : (
        <span>{token.text}</span>
      )}
    </div>
  );
};

interface SentenceProps {
  data: Sent;
  isActive?: boolean;
  isHuge?: boolean;
  className?: string;
}

export const Sentence = ({
  isActive,
  data,
  isHuge,
  className,
}: SentenceProps) => {
  const isOpenTranslation = useAtomValue(isOpenTranslationAtom);

  const size1 = isHuge ? "text-3xl" : "text-base";
  const size2 = isHuge ? "text-2xl" : "text-sm";

  return (
    <div className={classNames("pl-4 pr-2 text-start", className)}>
      <div className="flex flex-col">
        {data.tokens ? (
          <div
            id={"line" + data.id}
            className={classNames(
              "font-bold whitespace-pre flex flex-wrap",
              size1
            )}
          >
            {data.tokens.map((token) => {
              return (
                <>
                  <Word token={token} />
                  <div>{token.whitespace}</div>
                </>
              );
            })}
          </div>
        ) : (
          <h1
            id={"line" + data.id}
            className={classNames("font-bold text-start", size1)}
          >
            {data.text}
          </h1>
        )}
        {isOpenTranslation && (
          <p
            className={classNames(
              "text-muted-foreground mt-1 text-gray-400",
              size2
            )}
          >
            {data.translation}
          </p>
        )}
      </div>
    </div>
  );
};

export const SentenceButton = ({ isActive, data }: SentenceProps) => {
  const { sound, setSearchWord, setSearchSent } = useContext(PlayerContext)!;

  const skipToLine = () => {
    sound.seek(data.start);
  };

  return (
    <div className={"box-border line text-start min-w-[150px]"}>
      <div className="flex items-center">
        <button
          onClick={skipToLine}
          className={classNames(
            "grow p-2 rounded-lg",
            "hover:bg-gray-100",
            isActive && "bg-gray-100 active"
          )}
        >
          <div className="flex items-center">
            <Badge>{data.id}</Badge>
            <Sentence isActive={isActive} data={data} className={"grow"} />
            <Button size="icon" variant="outline" className="h-8 w-8">
              <MoreVertical className="h-3.5 w-3.5" />
              <span className="sr-only">More</span>
            </Button>
          </div>
        </button>
      </div>
    </div>
  );
};
