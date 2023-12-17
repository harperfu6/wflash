import "./Settings.css";

type ISettings = {
  wordLength: number;
  setWordLength: (count: number) => void;
  wordNum: number;
  setWordNum: (count: number) => void;
};

const Settings = (props: ISettings) => {
  const wordLength = () => props.wordLength;
  const setWordCount = props.setWordLength;
  const wordNum = () => props.wordNum;
  const setWordNum = props.setWordNum;

  const onWordLengthChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setWordCount(Number(target.value));
  };

  const onWordNumChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setWordNum(Number(target.value));
  };

  return (
    <>
      <h2>Settings</h2>
      <div>
        <input
          class="settings"
          type="number"
          value={wordLength()}
          onInput={onWordLengthChange}
        />
        文字程度の文を
        <input
          class="settings"
          type="number"
          value={wordNum()}
          onInput={onWordNumChange}
        />
        個
      </div>
    </>
  );
};

export default Settings;
