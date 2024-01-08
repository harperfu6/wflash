export const trimWords = (words: string[]) => {
  // ex: remove '1. ' from '1. answer'
  return words.map((word) => word.split(". ")[1]);
};

export const roundNumber = (num: number, digitNum: number = 2) => {
  return Math.ceil(num * 10 ** digitNum) / 10 ** digitNum;
};
