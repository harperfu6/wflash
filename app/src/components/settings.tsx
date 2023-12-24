import { ChatSettings } from "~/types";
import { Component } from "solid-js";
import "./settings.css";

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
      <h2>Settings</h2>
      <div>
        <input
          class="settings"
          type="number"
          value={props.settings.chatSettings.wordLength}
          onInput={onWordLengthChange}
        />
        文字程度の文を
        <input
          class="settings"
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
