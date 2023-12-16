import { createResource } from "solid-js";
import { createServerData$ } from "solid-start/server";
import OpenAI from "openai";

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

const _fetchWords = async () => {
  // return ["aaa", "bbb", "ccc"];

  const query = "10文字以上20文字以内の短文を5個上げて下さい";
  const reply = await chat(query);
  const lines = reply.message.content!;
  return lines.split("\n");
};

export const fetchWords = () => {
  // const [words] = createResource(_fetchWords); // on clinet side (cannot get process.env)
  const words = createServerData$(_fetchWords); // on server side
  return words;
};
