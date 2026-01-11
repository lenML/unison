import { Unison } from "./main";
import fs from "fs";

const text = Unison.Conversation.history(
  Unison.File.file(
    "env.d.ts",
    Unison.NS.ns("roles", [
      Unison.NS.type("system"),
      Unison.NS.type("developer"),
      Unison.NS.type("assistant"),
      Unison.NS.type("reasoning", "(_:{effort:ReasonEffort}) => string"),
      Unison.NS.type("user"),
    ]) + `\ntype ReasonEffort = "high" | "medium" | "low";`
  ),
  Unison.Message.role_content(
    Unison.ERole.system,
    "You are a helpful assistant."
  ),
  Unison.Message.role_content(
    Unison.ERole.user,
    "What is the purpose of this code?"
  ),
  Unison.Message.role_content(
    Unison.ERole.reasoning,
    `To provide a conversation history with roles and messages.`
  ),
  Unison.Message.role_content(
    Unison.ERole.assistant,
    "This code defines a namespace with roles and a conversation history with system and user messages."
  )
);

fs.writeFileSync("./example2.txt", text);
console.log("done");
