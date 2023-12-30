"use server"; // execute on server only
import { cache } from "@solidjs/router";
import { deleteCookie, getCookie, setCookie } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { ScoreDict } from "~/types"; // error if you define types in the file including `use server`

const cookieName = "score";

const _getScore = async (): Promise<ScoreDict[]> => {
  const event = getRequestEvent();
  const cookie = getCookie(event!, cookieName);
  console.log(cookie);
  if (cookie === undefined) {
    return [];
  } else {
    const score = JSON.parse(cookie);
    console.log(score);
    return score;
  }
};

const _setScore = async (score: number) => {
  const event = getRequestEvent();
  const currentScoreDictList: ScoreDict[] = await _getScore();

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
  setCookie(event!, cookieName, JSON.stringify(newScoreDictList), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const deleteScore = () => {
  const event = getRequestEvent();
  deleteCookie(event!, cookieName);
};

export const getScore = cache(_getScore, "getScore");
export const setScore = cache(async (score: number): Promise<void> => {
  return _setScore(score);
}, "setScore");
