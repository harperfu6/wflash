import { createSignal, Show, Suspense } from "solid-js";
import { createServerData$ } from "solid-start/server";
import Flash from "~/components/Flash";
import Settings from "~/components/Settings";
import { fetchWords } from "~/lib/fetchWords";
import { ChatSettings } from "~/types";

export default function Home() {
  // Chat Settings
  const [wordLength, setWordLength] = createSignal(10);
  const [wordNum, setWordNum] = createSignal(5);

  // Flash Settings
  const [intervalTime, setIntervalTime] = createSignal(1);

  // Fetch
  const [chatSettings, setChatSettings] = createSignal<
    ChatSettings | undefined
  >(undefined);

  const fetchedWords = createServerData$(fetchWords, {
    key: () => chatSettings(),
  });

  const onClickFetch = () => {
    // ここでcreateServerData$にreactiveな値を設定する
    setChatSettings({ wordLength: wordLength(), wordNum: wordNum() });
  };

  return (
    <main>
      <Suspense fallback={<div>文を生成中...</div>}>
        <Show
          when={fetchedWords()}
          fallback={
            <>
              <Settings
                wordLength={wordLength()}
                setWordLength={setWordLength}
                wordNum={wordNum()}
                setWordNum={setWordNum}
              />
              <button onClick={onClickFetch}>生成</button>
            </>
          }
        >
          <Flash
            words={fetchedWords()!}
            intervalTime={intervalTime()}
            setIntervalTime={setIntervalTime}
          />
        </Show>
      </Suspense>
    </main>
  );
}
