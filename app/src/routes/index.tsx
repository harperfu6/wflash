import { Show, createSignal } from "solid-js";
import Settings from "~/components/settings";
import FlashEntry from "~/components/flash";
import { isFetched, setIsFetched } from "~/store";

const buttonStyle = `
  px-3 py-2
  text-xs font-medium text-center text-white bg-blue-700
  rounded-lg
  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
  `;

export default function Home() {
  const [chatSettings, setChatSettings] = createSignal({
    wordNum: 5,
    wordLength: 30,
  });

  const onClickFetch = () => {
    setIsFetched(true);
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Show
        when={isFetched()}
        fallback={
          <>
            <div class="mb-4">
              <Settings
                settings={{
                  chatSettings: chatSettings(),
                  setChatSettings: setChatSettings,
                }}
              />
            </div>
            <button class={buttonStyle} onClick={onClickFetch}>
              生成
            </button>
          </>
        }
      >
        <FlashEntry chatSettings={chatSettings()} />
      </Show>
    </main>
  );
}
