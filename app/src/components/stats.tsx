import { cache, createAsync } from "@solidjs/router";
import { Component, For, Suspense } from "solid-js";
import { getScore } from "~/lib/score";

const getScoreCached = cache(getScore, "getScore");

const Stats: Component = () => {
  const scoreDictList = createAsync(getScoreCached);
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
