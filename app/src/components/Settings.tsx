type ISettings = {
  intervalTime: number;
  setIntervalTime: (time: number) => void;
};

const Settings = (props: ISettings) => {
  const intervalTime = () => props.intervalTime;
  const setIntervalTime = props.setIntervalTime;

  const onDurationChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setIntervalTime(Number(target.value));
  };

  return (
    <>
      <div>Settings</div>
      <input
        class="duration"
        type="number"
        value={intervalTime()}
        onInput={onDurationChange}
      />
    </>
  );
};

export default Settings;
