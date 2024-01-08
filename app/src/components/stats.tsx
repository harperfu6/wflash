import { Component, Suspense } from "solid-js";
import { getScore } from "~/lib/cookie";
import { onMount } from "solid-js";
import { ScoreDict } from "~/types";
import { setIsShowStats } from "~/store";

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
          class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
        >
          <div class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
            <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <h5
                class="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                id="exampleModalLabel"
              >
                Score History
              </h5>
              <button
                type="button"
                class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-te-modal-dismiss
                aria-label="Close"
                onclick={onClickClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
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
    </>
  );
};
export default Stats;
