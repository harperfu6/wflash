import { Accessor, Component, For } from "solid-js";
import { getCorrectAnswerNum } from "~/lib/checkAnswer";
import { getGame, setGame, setScore } from "~/lib/cookie";
import {
  answerList,
  isGame,
  setAnswerList,
  setIsFetched,
  setIsGame,
  setIsShowAnswer,
  setIsShowStats,
  setStartCount,
} from "~/store";

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
  words: Accessor<string[] | undefined>;
}> = (props) => {
  console.log(props.words());

  const placeholderList = Array.from(Array(props.words()!.length).keys()).map(
    (idx) => `${idx + 1}番目の文章を入力`,
  );

  if (answerList()!.length !== props.words()!.length) {
    setAnswerList(Array(props.words()!.length).fill(""));
  }

  const checkAnswer = async () => {
    if (!isGame()) {
      const answers = document.querySelectorAll<HTMLInputElement>(".answer");
      const answerList = Array.from(answers).map((answer) => answer.value);

      const correctAnswerNum = getCorrectAnswerNum(
        answerList,
        props.words()!.map((word) => word.split(". ")[1]), // ex: remove '1. ' from '1. answer'
      );

      await setScore(correctAnswerNum);
      await setGame();
      setIsGame(true);
      setIsShowStats(true);
    } else {
      setIsShowStats(true);
    }
  };

  const onInput = (idx: number) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const newAnswerList = answerList()!;
    newAnswerList[idx] = value;
    setAnswerList(newAnswerList);
  };

  const onClickRefetch = () => {
    setIsFetched(false);
    setIsShowAnswer(false);
    setIsShowStats(false);
    setStartCount(0);
  };

  return (
    <>
      {props.words() && (
        <For each={props.words()}>
          {(_, i) => {
            const answer = answerList()![i()];
            return (
              <ul class="list-none">
                <li>
                  <input
                    class="answer ring-1 m-2 p-2 w-96"
                    type="text"
                    value={answer}
                    placeholder={placeholderList[i()]}
                    onInput={onInput(i())}
                  />
                </li>
              </ul>
            );
          }}
        </For>
      )}
      <button class={buttonStyle} onClick={checkAnswer}>
        {isGame() ? "結果を見る" : "回答する"}
      </button>
      <button class={refetchButtonStyle} onClick={onClickRefetch}>
        文章を再生成
      </button>
    </>
  );
};

export default Answer;
