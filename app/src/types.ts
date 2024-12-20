export type ChatSettings = {
  wordLength: number;
  wordNum: number;
};

export type ScoreDict = {
  correctNum: number;
  historyNum: number;
};

export type GameDict = {
  isGame: boolean;
  todayScore: number;
  todayWords: string[];
  todayAnswers: string[];
  todayCorrects: string[];
  todaySims: number[];
};

export enum SimilarityMethod {
  SAME = "same",
  LEVENSHTEIN = "levenshtein",
}
