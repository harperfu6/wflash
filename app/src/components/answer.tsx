import { Accessor, Component, For, Show } from "solid-js";
import { maxFetchCount, similarityThreshold } from "~/const";
import { getSimilarityList } from "~/lib/checkAnswer";
import { setGame, setScore } from "~/lib/cookie";
import {
  answerList,
  fetchCount,
  isGame,
  setAnswerList,
  setIsFetched,
  setIsGame,
  setIsShowAnswer,
  setIsShowStats,
  setStartCount,
} from "~/store";
import { trimWords } from "~/utils";

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

      const similarityList = getSimilarityList(
        answerList,
        trimWords(props.words()!),
      );

      const correctList = similarityList.map(
        (similarity: number) => similarity >= similarityThreshold,
      );

      const correctAnswerNum = correctList.filter(
        (isCorrect: boolean) => isCorrect,
      ).length;

      await setScore(correctAnswerNum);
      await setGame(
        correctAnswerNum,
        trimWords(props.words()!),
        answerList,
        correctList,
        similarityList,
      );

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
      <Show
        when={fetchCount() < maxFetchCount}
        fallback={
          <div>
            文章の再生成回数の上限を超えました。現在の文章で回答を送信してください。
          </div>
        }
      >
        {!isGame() && (
          <div class="flex justify-center items-center">
            <button class={refetchButtonStyle} onClick={onClickRefetch}>
              文章を再生成
            </button>
            <div class="ml-8">あと{maxFetchCount - fetchCount()}回まで</div>
          </div>
        )}
      </Show>
    </>
  );
};

export default Answer;
