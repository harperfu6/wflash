import { createSignal, Show, Suspense } from "solid-js";
import Flash from "~/components/Flash";
import Settings from "~/components/Settings";
import { fetchWordsOnSignal } from "~/lib/fetchWords";

export default function Home() {
  const [isFetch, setIsFetch] = createSignal(false);
  const words = fetchWordsOnSignal(isFetch)();

  // Settings
  const [intervalTime, setIntervalTime] = createSignal(1);

  const onClickFetch = () => {
    setIsFetch(true);
  };

  return (
    <main>
      <Suspense fallback={<div>loading...</div>}>
        <Show
          when={words()}
          fallback={
            <>
              <Settings
                intervalTime={intervalTime()}
                setIntervalTime={setIntervalTime}
              />
              <div>
                <button onClick={onClickFetch}>fetch</button>
              </div>
            </>
          }
        >
          <Flash words={words()!} inertvalTime={intervalTime()} />
        </Show>
      </Suspense>
    </main>
  );
}
