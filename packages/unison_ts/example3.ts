import { Unison } from "./main";
import fs from "fs";

const messages = [
  {
    role: Unison.ERole.system,
    content: "You are a helpful assistant.",
  },
  {
    role: Unison.ERole.user,
    content: "What is the purpose of this code?",
  },
  {
    role: Unison.ERole.reasoning,
    content: `To provide a conversation history with roles and messages.`,
  },
  {
    role: Unison.ERole.assistant,
    content:
      "This code defines a namespace with roles and a conversation history with system and user messages.",
  },
];

const text = Unison.Conversation.history(
  Unison.Defaults.Reasoner.envDts,
  ...Unison.Conversation.from_messages(messages)
);
fs.writeFileSync("./example3.txt", text);
console.log("done");
