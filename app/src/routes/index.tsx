import { Show, Suspense, createSignal } from "solid-js";
import Settings from "~/components/settings";
import FlashEntry from "~/components/flash";
import {
  fetchCount,
  isFetched,
  isShowStats,
  setFetchCount,
  setIsFetched,
  setIsShowStats,
} from "~/store";
import { defaultWordLength, defaultWordNum, maxFetchCount } from "~/const";
import { createAsync } from "@solidjs/router";
import { getGame } from "~/lib/cookie";
import Stats from "~/components/stats";

const buttonStyle = `
  px-3 py-2
  text-lg font-medium text-center text-white bg-blue-700
  rounded-lg
  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
  `;

export default function Home() {
  const cookeiIsGame = createAsync(getGame);

  const [chatSettings, setChatSettings] = createSignal({
    wordNum: defaultWordNum,
    wordLength: defaultWordLength,
  });

  const onClickFetch = async () => {
    setIsFetched(true);
    setFetchCount(fetchCount() + 1);
  };

  const onClickShowStats = () => {
    setIsShowStats(true);
  };

  return (
    <main class="flex flex-col items-center justify-center min-h-screen text-center mx-auto text-gray-700 p-4">
      <Suspense fallback={<div>本日のゲーム情報を取得中...</div>}>
        <Show when={cookeiIsGame()}>
          {cookeiIsGame()!.isGame && (
            <>
              <div class="flex justify-center">
                <button class={buttonStyle} onClick={onClickShowStats}>
                  今日の結果をみる
                </button>
              </div>
              {isShowStats() && <Stats />}
            </>
          )}
          {!cookeiIsGame()!.isGame && (
            <Show
              when={fetchCount() <= maxFetchCount}
              fallback={
                <div>
                  本日の文章の生成回数の上限を超えました。明日また再チャレンジしてください。
                </div>
              }
            >
              <Show
                when={isFetched()}
                fallback={
                  <>
                    <div class="flex flex-col justify-center">
                      <div class="mb-4">
                        <Settings
                          settings={{
                            chatSettings: chatSettings(),
                            setChatSettings: setChatSettings,
                          }}
                        />
                      </div>
                      <div class="ml-4">
                        <button class={buttonStyle} onClick={onClickFetch}>
                          生成
                        </button>
                      </div>
                    </div>
                  </>
                }
              >
                <FlashEntry chatSettings={chatSettings()} />
              </Show>
            </Show>
          )}
        </Show>
      </Suspense>
    </main>
  );
}
