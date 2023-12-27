import { createAsync } from "@solidjs/router";
import {
  Component,
  For,
  Show,
  Suspense,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { getWords } from "~/lib/api";
import { ChatSettings } from "~/types";
import "./flash.css";

const Flash: Component<{
  words: string[];
  setIsFetched: (isFetched: boolean) => void;
}> = (props) => {
  const [wordIdx, setWordIdx] = createSignal(0);
  const [isStarted, setIsStarted] = createSignal(false);
  const [isShowWords, setIsShowWords] = createSignal(false);
  const [intervalTime, setIntervalTime] = createSignal(1.5);

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
    if (props.words && wordIdx() === props.words.length) {
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
      <button class="flash" onClick={() => props.setIsFetched(false)}>
        文章を再生成
      </button>
      <div>各文の表示時間</div>
      <div>
        <input
          class="settings"
          type="number"
          value={intervalTime()}
          onInput={onDurationChange}
        />
      </div>
      {isStarted() && <div class="word">{props.words[wordIdx()]}</div>}
      {isShowWords() && (
        <For each={props.words}>{(word) => <div>{word}</div>}</For>
      )}
    </>
  );
};

const FlashEntry: Component<{
  chatSettings: ChatSettings;
  setIsFetched: (isFetched: boolean) => void;
}> = (props) => {
  const words = createAsync(() => getWords(props.chatSettings));
  return (
    <Suspense fallback={<div>文を生成中...</div>}>
      <Show when={words()}>
        <Flash words={words()!} setIsFetched={props.setIsFetched} />
      </Show>
    </Suspense>
  );
};

export default FlashEntry;
