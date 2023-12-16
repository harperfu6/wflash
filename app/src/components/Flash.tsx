import { createEffect, createSignal, For, onCleanup } from "solid-js";
import "./Flash.css";

type IFlash = {
  words: string[];
};

const Flash = (props: IFlash) => {
  const words = () => props.words;
  const [wordIdx, setWordIdx] = createSignal(0);
  const [isStarted, setIsStarted] = createSignal(false);
  const [isShowWords, setIsShowWords] = createSignal(false);
  const [intervalTime, setIntervalTime] = createSignal(1);

  const onClickStart = () => {
    setIsStarted(true);
    timer();
  };

  const onClickShowWords = () => {
    setIsShowWords(!isShowWords());
  };

  const onDurationChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setIntervalTime(Number(target.value));
  };

  createEffect(() => {
    if (words && wordIdx() === words().length) {
      clearInterval(intervalId);
      setIsStarted(false);
      setWordIdx(0);
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
      <input
        class="duration"
        type="number"
        value={intervalTime()}
        onInput={onDurationChange}
      />
      {isStarted() && <div class="word">{words()[wordIdx()]}</div>}
      {isShowWords() && <For each={words()}>{(word) => <div>{word}</div>}</For>}
    </>
  );
};

export default Flash;
