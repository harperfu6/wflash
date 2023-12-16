import { createEffect, createSignal, onCleanup } from "solid-js";
import "./Flash.css";

const Flash = () => {
  const words = ["aaa", "bbb", "ccc"]; // sample word list
  const [wordIdx, setWordIdx] = createSignal(0);
  const [isStarted, setIsStarted] = createSignal(false);
  const onClickStart = () => {
    setIsStarted(true);
    timer();
  };
  let intervalId: NodeJS.Timeout;

  createEffect(() => {
    if (wordIdx() === words.length) {
      clearInterval(intervalId);
      setIsStarted(false);
      setWordIdx(0);
    }
  });

  const timer = () => {};
  intervalId = setInterval(() => setWordIdx((i) => i + 1), 1000);

  onCleanup(() => clearInterval(intervalId));

  return (
    <>
      <button class="flash" onClick={onClickStart}>
        start
      </button>
      {isStarted() && <div>{words[wordIdx()]}</div>}
    </>
  );
};

export default Flash;
