import { Show, createSignal } from "solid-js";
import Settings from "~/components/settings";
import FlashEntry from "~/components/flash";

// export const route = {
//   load: () => getScore(),
// };

export default function Home() {
  const [chatSettings, setChatSettings] = createSignal({
    wordNum: 5,
    wordLength: 30,
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
