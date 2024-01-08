import { SimilarityMethod } from "~/types";
import { defaultSimilarityMethod } from "~/const";
import { sameDistance } from "./similarity/same";
import { levenshteinDistance } from "./similarity/levenshtein";
import { roundNumber } from "~/utils";

const calcSimilarity = (
  answer: string,
  correctAnswer: string,
  similarityMethod: SimilarityMethod,
): number => {
  // remove all '。' and '、' from the strings
  answer = answer.replace(/。/g, "").replace(/、/g, "");
  correctAnswer = correctAnswer.replace(/。/g, "").replace(/、/g, "");

  let similarity = 0;
  if (similarityMethod === SimilarityMethod.SAME) {
    similarity = sameDistance(answer, correctAnswer);
  } else if (similarityMethod === SimilarityMethod.LEVENSHTEIN) {
    similarity = levenshteinDistance(answer, correctAnswer);
  } else {
    throw new Error("Invalid similarity method");
  }

  return roundNumber(similarity);
};

export const getSimilarityList = (
  answers: string[],
  correctAnswers: string[],
  similarityMethod: SimilarityMethod = defaultSimilarityMethod,
): number[] => {
  return answers.map((answer, index) =>
    calcSimilarity(answer, correctAnswers[index], similarityMethod),
  );
};
