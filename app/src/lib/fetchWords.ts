import OpenAI from "openai";
import { ChatSettings } from "~/types";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

async function chat(query: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: query }],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0];
}

export const fetchWords = async (chatSettings: ChatSettings) => {
  const query = `${chatSettings.wordLength}文字程度の短文を${chatSettings.wordNum}個上げて下さい`;
  const reply = await chat(query);
  const lines = reply.message.content!;
  return lines.split("\n");
};

// 以下は今後のための参考
// export const fetchWords = () => {
//   // const [words] = createResource(_fetchWords); // on clinet side (cannot get process.env)
//   const words = createServerData$(_fetchWords); // on server side (createServerData$ is routeData + useRouteData + createResource + server$)
//   return words;
// };

// export const fetchWordsOnSignal = (fetchSignal: Accessor<boolean>) => () => {
//   const [words] = createResource(fetchSignal, server$(_fetchWords)); // on server side
//   return words;
// };
