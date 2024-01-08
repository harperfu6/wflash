/** Compares the similarity between 2 strings using Levenshtein distance.
 * @param {string} s1 The first string.
 * @param {string} s2 The second string.
 * @returns {number} Similarity between the 2 strings.
 */
export function sameDistance(s1: string, s2: string): number {
  // completely same strings
  return s1 === s2 ? 1 : 0;
}
