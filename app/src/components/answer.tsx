import { Component, For } from "solid-js";
import "./answer.css";
import { getCorrectAnswerNum } from "~/lib/checkAnswer";
import { setScore } from "~/lib/score";

const Answer: Component<{
  words: string[];
  setCorrectNum: (correctNum: number) => void;
  setIsShowStats: (isShowStats: boolean) => void;
}> = (props) => {
  const checkAnswer = async () => {
    const answers = document.querySelectorAll<HTMLInputElement>(".answer");
    const answerList = Array.from(answers).map((answer) => answer.value);

    const correctAnswerNum = getCorrectAnswerNum(
      answerList,
      props.words.map((word) => word.split(". ")[1]), // ex: remove '1. ' from '1. answer'
    );

    await setScore(correctAnswerNum);
    props.setIsShowStats(true);
  };

  return (
    <>
      {props.words && (
        <For each={props.words}>
          {(_, i) => {
            const idx = i() + 1;
            return (
              <ul>
                <li>
                  <input
                    class="answer"
                    type="text"
                    placeholder={`${idx.toString()}番目の回答を入力してください`}
                  />
                </li>
              </ul>
            );
          }}
        </For>
      )}
      <button onClick={checkAnswer}>回答を送信</button>
    </>
  );
};

export default Answer;
