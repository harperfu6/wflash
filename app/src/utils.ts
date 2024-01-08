export const trimWords = (words: string[]) => {
  // ex: remove '1. ' from '1. answer'
  return words.map((word) => word.split(". ")[1]);
};
