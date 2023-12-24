"use server"; // execute on server only
import { cache } from "@solidjs/router";
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

const fetchWords = async (chatSettings: ChatSettings) => {
  const query = `${chatSettings.wordLength}文字程度の短文を${chatSettings.wordNum}個上げて下さい`;
  const reply = await chat(query);
  const lines = reply.message.content!;
  return lines.split("\n");
};

export const getWords = cache(
  async (chatSettings: ChatSettings): Promise<string[]> => {
    return fetchWords(chatSettings);
  },
  "words",
);
