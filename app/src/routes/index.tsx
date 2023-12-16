import Flash from "~/components/Flash";
import { fetchWords } from "~/lib/fetchWords";

export default function Home() {
  const words = fetchWords();

  return (
    <main>
      <Flash words={words()!} />
    </main>
  );
}
