import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  curSentenceIdAtom,
  isOpenTranslationAtom,
  AudioContext,
} from "@/store";
import { Sent, Token } from "@/types";
import { isWord } from "@/utils";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { MoreVertical } from "lucide-react";
import { useContext, useState, useEffect } from "react";

interface WordProps {
  token: Token;
  isLarge: boolean;
}

const wordSize = {
  small: ["text-[10px] leading-[12px]", "text-xs", "text-sm"],
  large: ["text-base", "text-2xl", "text-3xl"],
};

const Word = ({ token, isLarge: isHuge }: WordProps) => {
  const { kuroshiro } = useContext(AudioContext)!;
  const [hiragana, setHiragana] = useState("");
  const [size1, size2, size3] = isHuge ? wordSize.large : wordSize.small;

  useEffect(() => {
    const handleKanji = async () => {
      if (kuroshiro?.Util.hasKanji(token.text)) {
        const result =
          (await kuroshiro?.convert(token.text, { to: "hiragana" })) || "";
        setHiragana(result);
      }
    };
    handleKanji();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token.text]);

  return (
    <div className="font-sans">
      {isWord(token) ? (
        <button>
          <div
            className={classNames(
              "flex flex-col",
              "box-border border border-transparent rounded cursor-pointer",
              "hover:bg-orange-300"
            )}
          >
            {hiragana && <span className={size1}>{hiragana}</span>}
            <span className={size3}>{token.text}</span>
          </div>
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
  isHuge: isLarge = false,
  className,
}: SentenceProps) => {
  const isOpenTranslation = useAtomValue(isOpenTranslationAtom);

  const [size1, size2, size3] = isLarge ? wordSize.large : wordSize.small;

  return (
    <div className={classNames("text-start", className)}>
      <div className="flex flex-col text-xl">
        {data.tokens ? (
          <div
            id={"line_" + data.id}
            className={classNames(
              "font-bold whitespace-pre flex flex-wrap items-end content-end",
              size3
            )}
          >
            {data.tokens.map((token) => {
              return (
                <>
                  <Word token={token} isLarge={isLarge} />
                  <div>{token.whitespace}</div>
                </>
              );
            })}
          </div>
        ) : (
          <h1
            id={"line" + data.id}
            className={classNames("font-bold text-start", size3)}
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
  const { state, player } = useContext(AudioContext)!;

  const skipToLine = () => {
    player?.seek(data.start);
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
            <Badge className={wordSize.small[0]}>{data.id}</Badge>
            <Sentence isActive={isActive} data={data} className={"grow ml-2"} />
            <Button
              size="icon"
              variant="outline"
              className="grow-0 shrink-0 ml-2 h-6 w-6"
            >
              <MoreVertical className="h-3.5 w-3.5" />
              <span className="sr-only">More</span>
            </Button>
          </div>
        </button>
      </div>
    </div>
  );
};
