"use server"; // execute on server only
import { deleteCookie, getCookie, setCookie } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { GameDict, ScoreDict } from "~/types"; // error if you define types in the file including `use server`

const scoreCookieName = "wflash-score";
const gameCookieName = "wflash-game";

const secondsToTomorrow = () => {
  // 次の日の0時（24時）までの残り時間（秒）
  const now = new Date(
    Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000,
  ); // JST
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
  );
  return (tomorrow.getTime() - today.getTime()) / 1000; // 今日の残り時間（秒）
};

const today = new Date(
  Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000,
); // JST
const tomorrow = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1, // 次の日の0時（24時）
  0,
  0,
  0,
);

export const getScore = async (): Promise<ScoreDict[]> => {
  const event = getRequestEvent();
  const cookie = getCookie(event!, scoreCookieName);
  if (cookie === undefined) {
    return [];
  } else {
    const score = JSON.parse(cookie);
    return score;
  }
};

export const setScore = async (score: number) => {
  const event = getRequestEvent();
  const currentScoreDictList: ScoreDict[] = await getScore();

  const isExist = currentScoreDictList.some(
    (scoreDict: ScoreDict) => scoreDict.correctNum === score,
  );

  let newScoreDictList: ScoreDict[];
  if (isExist) {
    newScoreDictList = currentScoreDictList.map((scoreDict: ScoreDict) => {
      if (scoreDict.correctNum === score) {
        return {
          correctNum: scoreDict.correctNum,
          historyNum: scoreDict.historyNum + 1,
        };
      } else {
        return scoreDict;
      }
    });
  } else {
    newScoreDictList = [
      ...currentScoreDictList,
      { correctNum: score, historyNum: 1 },
    ];
  }
  setCookie(event!, scoreCookieName, JSON.stringify(newScoreDictList), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
};

export const deleteScore = () => {
  const event = getRequestEvent();
  deleteCookie(event!, scoreCookieName);
};

export const getGame = async (): Promise<GameDict> => {
  const event = getRequestEvent();
  const cookie = getCookie(event!, gameCookieName);
  if (cookie === undefined) {
    return { isGame: false, todayScore: 0 };
  } else {
    const isGame = JSON.parse(cookie);
    return isGame;
  }
};

export const setGame = async (todayScore: number) => {
  const event = getRequestEvent();
  setCookie(
    event!,
    gameCookieName,
    JSON.stringify({ isGame: true, todayScore }),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: secondsToTomorrow(),
    },
  );
};

export const deleteGame = () => {
  const event = getRequestEvent();
  deleteCookie(event!, gameCookieName);
};
