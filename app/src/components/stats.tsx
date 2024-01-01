import { Component, Suspense } from "solid-js";
import { getScore } from "~/lib/score";
import { onMount } from "solid-js";
import { ScoreDict } from "~/types";

const optionsBarHorizontal = {
  options: {
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          borderDash: [2],
          zeroLineColor: "rgba(0,0,0,0)",
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)",
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)",
        },
      },
    },
  },
};

const scoreDictList2barData = (scoreDictList: ScoreDict[]) => {
  // sort by correctNum
  const _scoreDictList = scoreDictList.sort((a: ScoreDict, b: ScoreDict) => {
    return a.correctNum - b.correctNum;
  });

  const dataBar = {
    type: "bar",
    data: {
      labels: _scoreDictList.map(
        (scoreDict) => `正解数: ${scoreDict.correctNum}`,
      ),
      datasets: [
        {
          label: "回数",
          data: _scoreDictList.map((scoreDict) => scoreDict.historyNum),
        },
      ],
    },
  };

  return dataBar;
};

const Stats: Component = () => {
  onMount(async () => {
    const twe = await import("tw-elements");
    const Chart = twe.Chart;
    const scoreDictList = await getScore();
    new Chart(
      document.getElementById("bar-chart"),
      scoreDictList2barData(scoreDictList),
      optionsBarHorizontal,
    );
  });

  return (
    <>
      <Suspense fallback={<div>loading stats...</div>}>
        <div class="mx-auto w-11/12 overflow-hidden md:w-3/5">
          <canvas id="bar-chart"></canvas>
        </div>
      </Suspense>
    </>
  );
};
export default Stats;
