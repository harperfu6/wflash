import { Component, For } from "solid-js";
import { getCorrectAnswerNum } from "~/lib/checkAnswer";
import { getScore, setScore } from "~/lib/score";

const buttonStyle = `
  m-2
  px-3 py-2
  text-lg font-medium text-center text-white bg-blue-700
  rounded-lg
  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
  `;

const refetchButtonStyle = `
  m-2
  px-3 py-2
  text-sm font-medium text-center text-white bg-yellow-400
  rounded-lg
  hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-200
  dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:ring-yellow-500
  `;

const Answer: Component<{
  words: string[];
  setIsShowStats: (isShowStats: boolean) => void;
  setIsFetched: (isFetched: boolean) => void;
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
              <ul class="list-none">
                <li>
                  <input
                    class="ring-1 answer"
                    type="text"
                    placeholder={`${idx.toString()}番目の回答を入力してください`}
                  />
                </li>
              </ul>
            );
          }}
        </For>
      )}
      <button class={buttonStyle} onClick={checkAnswer}>
        回答を送信
      </button>
      <button
        class={refetchButtonStyle}
        onClick={() => props.setIsFetched(false)}
      >
        文章を再生成
      </button>
    </>
  );
};

export default Answer;
