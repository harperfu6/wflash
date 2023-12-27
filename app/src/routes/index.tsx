import { Show, createSignal } from "solid-js";
import Settings from "~/components/settings";
import FlashEntry from "~/components/flash";

export default function Home() {
  const [chatSettings, setChatSettings] = createSignal({
    wordLength: 30,
    wordNum: 5,
  });

  const [isFetched, setIsFetched] = createSignal(false);
  const onClickFetch = () => {
    setIsFetched(true);
  };

  return (
    <main>
      <Show
        when={isFetched()}
        fallback={
          <>
            <Settings
              settings={{
                chatSettings: chatSettings(),
                setChatSettings: setChatSettings,
              }}
            />
            <button onClick={onClickFetch}>文章を生成</button>
          </>
        }
      >
        <FlashEntry chatSettings={chatSettings()} setIsFetched={setIsFetched} />
      </Show>
    </main>
  );
}
