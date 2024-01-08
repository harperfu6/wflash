import { createSignal } from "solid-js";

export const [isGame, setIsGame] = createSignal<boolean>(false);
export const [isFetched, setIsFetched] = createSignal<boolean>(false);
export const [isStarted, setIsStarted] = createSignal<boolean>(false);
export const [startCount, setStartCount] = createSignal<number>(0);
export const [fetchCount, setFetchCount] = createSignal<number>(0);
export const [isShowAnswer, setIsShowAnswer] = createSignal<boolean>(false);
export const [isShowStats, setIsShowStats] = createSignal<boolean>(false);
export const [answerList, setAnswerList] = createSignal<string[]>([]);
