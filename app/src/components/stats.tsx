import { createAsync } from "@solidjs/router";
import { Component, For, Suspense } from "solid-js";
import { getScore, setScore } from "~/lib/score";

const Stats: Component<{ score: number | undefined }> = (props) => {
  if (props.score) {
    createAsync(() => setScore(props.score!));
  }
  const scoreDictList = createAsync(getScore);
  return (
    <>
      <Suspense fallback={<div>loading stats...</div>}>
        <For each={scoreDictList()!}>
          {(scoreDict, _) => (
            <li>
              {scoreDict.correctNum}: {scoreDict.historyNum}
            </li>
          )}
        </For>
      </Suspense>
    </>
  );
};

export default Stats;
