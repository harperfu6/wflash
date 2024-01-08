const checkAnswer = (answer: string, correctAnswer: string) => {
  return answer === correctAnswer;
};

export const getCorrectList = (
  answers: string[],
  correctAnswers: string[],
): boolean[] => {
  console.log(answers);
  console.log(correctAnswers);
  return answers.map((answer, index) =>
    checkAnswer(answer, correctAnswers[index]) ? true : false,
  );
};
