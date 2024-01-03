"use server"; // execute on server only
import { cache } from "@solidjs/router";
import OpenAI from "openai";
import { ChatSettings } from "~/types";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "OpenAIAPIKey";
const keyName = "open_ai_api_key";
const client = new SecretsManagerClient({
  region: "ap-northeast-1",
});

const setSecret = async () => {
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  // set secret to env
  return JSON.parse(response.SecretString!)[keyName];
};

const chat = async (query: string) => {
  let secret;
  if (process.env["OPENAI_API_KEY"]) {
    // for local development
    secret = process.env["OPENAI_API_KEY"];
  } else {
    // for production
    console.log(
      "can't find OPENAI_API_KEY in env. fetch from AWS Secrets Manager",
    );
    secret = await setSecret();
  }
  const openai = new OpenAI({
    apiKey: secret,
  });
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: query }],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0];
};

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
