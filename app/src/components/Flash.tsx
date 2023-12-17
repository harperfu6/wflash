import { createEffect, createSignal, For, onCleanup } from "solid-js";
import "./Flash.css";

type IFlash = {
  words: string[];
  inertvalTime: number;
};

const Flash = (props: IFlash) => {
  const words = () => props.words;
  const intervalTime = () => props.inertvalTime;

  const [wordIdx, setWordIdx] = createSignal(0);
  const [isStarted, setIsStarted] = createSignal(false);
  const [isShowWords, setIsShowWords] = createSignal(false);

  const onClickStart = () => {
    setIsStarted(true);
    timer();
  };

  const onClickShowWords = () => {
    setIsShowWords(!isShowWords());
  };

  createEffect(() => {
    if (words && wordIdx() === words().length) {
      setIsStarted(false);
      setWordIdx(0);
      clearInterval(intervalId);
    }
  });

  let intervalId: NodeJS.Timeout;
  const timer = () => {
    intervalId = setInterval(
      () => setWordIdx((i) => i + 1),
      intervalTime() * 1000,
    );
  };

  onCleanup(() => clearInterval(intervalId));

  return (
    <>
      <button class="flash" onClick={onClickStart}>
        start
      </button>
      <button class="flash" onClick={onClickShowWords}>
        {isShowWords() ? "hide words" : "show words"}
      </button>
      {isStarted() && <div class="word">{words()[wordIdx()]}</div>}
      {isShowWords() && <For each={words()}>{(word) => <div>{word}</div>}</For>}
    </>
  );
};

export default Flash;
