import { createAsync } from "@solidjs/router";
import {
  Accessor,
  Component,
  Show,
  Suspense,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { getWords } from "~/lib/openAI";
import { ChatSettings } from "~/types";
import Stats from "./stats";
import Answer from "./answer";
import {
  isShowAnswer,
  isShowStats,
  isStarted,
  isStartedOnece,
  setIsShowAnswer,
  setIsShowStats,
  setIsStarted,
  setIsStartedOnece,
} from "~/store";

const buttonStyle = `
  px-3 py-2
  text-lg font-medium text-center text-white bg-blue-700
  rounded-lg
  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
  `;

const countDownList = ["3", "2", "1", "GO!"];

const Flash: Component<{
  words: Accessor<string[] | undefined>;
}> = (props) => {
  const [wordIdx, setWordIdx] = createSignal(0);
  const [intervalTime, setIntervalTime] = createSignal(1.5);

  const onClickStart = () => {
    setIsStarted(true);
    setIsStartedOnece(true);
    setIsShowAnswer(false);
    setIsShowStats(false);
    timer();
  };

  const onDurationChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setIntervalTime(Number(target.value));
  };

  createEffect(() => {
    if (
      props.words() &&
      wordIdx() === props.words()!.length + countDownList.length
    ) {
      setIsStarted(false);
      setWordIdx(0);
      clearInterval(intervalId);
      setIsShowAnswer(true);
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
      {!isStarted() && (
        <div class="flex flex-row justify-center content-center items-center">
          <div>
            <div>各文の表示時間</div>
            <div class="flex justify-center">
              <div>
                <input
                  class="text-2xl font-bold text-[#335d92] ml-4 w-16 h-6"
                  type="number"
                  value={intervalTime()}
                  onInput={onDurationChange}
                />
              </div>
              <div>秒</div>
            </div>
          </div>
          <div class="ml-8 mt-1">
            <button class={buttonStyle} onClick={onClickStart}>
              {isStartedOnece() ? "再開" : "開始"}
            </button>
          </div>
        </div>
      )}
      {isStarted() && (
        <div class="text-[1.5em] text-[#335d92] font-bold mt-[1em];">
          {countDownList.concat(props.words()!)[wordIdx()]}
        </div>
      )}
      {!isStarted() && isShowAnswer() && <Answer words={props.words} />}
      {isShowStats() && <Stats />}
    </>
  );
};

const FlashEntry: Component<{
  chatSettings: ChatSettings;
}> = (props) => {
  const words = createAsync(() => getWords(props.chatSettings));
  return (
    <Suspense fallback={<div>文章を生成中...</div>}>
      <Show when={words()}>
        <Flash words={words!} />
      </Show>
    </Suspense>
  );
};

export default FlashEntry;
