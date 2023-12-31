const checkAnswer = (answer: string, correctAnswer: string) => {
  return answer === correctAnswer;
};

export const getCorrectAnswerNum = (
  answers: string[],
  correctAnswers: string[],
) => {
  console.log(answers);
  console.log(correctAnswers);
  return answers.filter((answer, index) =>
    checkAnswer(answer, correctAnswers[index]),
  ).length;
};
