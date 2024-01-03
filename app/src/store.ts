import { createSignal } from "solid-js";

export const [isFetched, setIsFetched] = createSignal<boolean>(false);
export const [isStarted, setIsStarted] = createSignal<boolean>(false);
export const [isShowAnswer, setIsShowAnswer] = createSignal<boolean>(false);
export const [isShowStats, setIsShowStats] = createSignal<boolean>(false);
export const [answerList, setAnswerList] = createSignal<string[] | undefined>(
  undefined,
);
