import { Component, Show, Suspense } from "solid-js";
import { getScore, getGame } from "~/lib/cookie";
import { onMount } from "solid-js";
import { GameDict, ScoreDict } from "~/types";
import { answerList, setIsShowStats } from "~/store";
import { createAsync } from "@solidjs/router";

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
          precision: 0, // integer only
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(0,0,0, 0.5)",
          font: {
            size: 10,
          },
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

const Chart: Component = () => {
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

const Stats: Component = () => {
  const todayGame = createAsync(getGame);

  onMount(async () => {
    const twe = await import("tw-elements");
    const Chart = twe.Chart;
    const Modal = twe.Modal;

    const scoreDictList = await getScore();
    new Chart(
      document.getElementById("bar-chart"),
      scoreDictList2barData(scoreDictList),
      optionsBarHorizontal,
    );

    const myModal = new Modal(document.getElementById("statsModal"), {});
    await myModal.show();
  });

  const onClickClose = () => {
    setIsShowStats(false);
  };

  return (
    <>
      <Show when={todayGame()}>
        <div
          data-te-modal-init
          class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="statsModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            data-te-modal-dialog-ref
            class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[800px]"
          >
            <div class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
              <div>
                <h5 class="mt-5 text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                  本日の正解数
                </h5>
                <h5 class="mt-1 text-2xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                  {todayGame()?.todayScore}
                </h5>
              </div>
              <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"></div>
              <div>
                <table class="min-w-full text-left text-sm font-light">
                  <thead class="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" class="px-6 py-4">
                        出題
                      </th>
                      <th scope="col" class="px-6 py-4">
                        回答
                      </th>
                      <th scope="col" class="px-6 py-4">
                        正否
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayGame()?.todayWords.map((word, idx) => {
                      return (
                        <tr class="border-b border-neutral-100 dark:border-neutral-500">
                          <td class="px-6 py-4">{word}</td>
                          <td class="px-6 py-4">
                            {todayGame()?.todayAnswers[idx]}
                          </td>
                          <td class="px-6 py-4 text-center">
                            {todayGame()?.todayCorrects[idx] ? (
                              <div class="text-4xl text-red-400 ">○</div>
                            ) : (
                              <div class="text-2xl text-blue-400 ">×</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div class="relative flex-auto p-4" data-te-modal-body-ref>
                <Chart />
              </div>
              <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <button
                  type="button"
                  class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  data-te-modal-dismiss
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onclick={onClickClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};
export default Stats;
