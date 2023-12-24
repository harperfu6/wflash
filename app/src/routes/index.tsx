import { Show, createSignal } from "solid-js";
import Settings from "~/components/settings";
import FlashEntry from "~/components/flash";

export default function Home() {
  const [isFetched, setIsFetched] = createSignal(false);

  // Chat Settings
  const [chatSettings, setChatSettings] = createSignal({
    wordLength: 30,
    wordNum: 5,
  });

  const handleClick = () => {
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
            <button onClick={handleClick}>fetch</button>
          </>
        }
      >
        <FlashEntry chatSettings={chatSettings()} />
      </Show>
    </main>
  );
}
