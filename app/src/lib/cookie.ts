"use server"; // execute on server only
import { deleteCookie, getCookie, setCookie } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { GameDict, ScoreDict } from "~/types"; // error if you define types in the file including `use server`

const scoreCookieName = "wflash-score";
const gameCookieName = "wflash-game";

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
    return { isGame: false };
  } else {
    const isGame = JSON.parse(cookie);
    return isGame;
  }
};

export const setGame = async () => {
  const event = getRequestEvent();
  setCookie(event!, gameCookieName, JSON.stringify({ isGame: true }), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1, // 1 day
  });
};

export const deleteGame = () => {
  const event = getRequestEvent();
  deleteCookie(event!, gameCookieName);
};
