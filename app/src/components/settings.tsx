import { ChatSettings } from "~/types";
import { Component } from "solid-js";

type ISettings = {
  chatSettings: ChatSettings;
  setChatSettings: (chatSettings: ChatSettings) => void;
};
const Settings: Component<{ settings: ISettings }> = (props) => {
  const onWordLengthChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    props.settings.setChatSettings({
      ...props.settings.chatSettings,
      wordLength: Number(target.value),
    });
  };

  const onWordNumChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    props.settings.setChatSettings({
      ...props.settings.chatSettings,
      wordNum: Number(target.value),
    });
  };

  return (
    <>
      <div>
        <input
          class="text-2xl font-bold text-[#335d92] ml-4 w-16 h-6"
          type="number"
          value={props.settings.chatSettings.wordLength}
          onInput={onWordLengthChange}
        />
        文字程度の文章を
        <input
          class="text-2xl font-bold text-[#335d92] ml-4 w-16 h-6"
          type="number"
          value={props.settings.chatSettings.wordNum}
          onInput={onWordNumChange}
        />
        個
      </div>
    </>
  );
};

export default Settings;
