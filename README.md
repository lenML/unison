<center>
<h1 align="center">Unison</h1>
<p align="center">LLM chat response format.</p>
</center>
Renderer for the unison response format.

```text
<|file|>env.d.ts<|stdout|>declare namespace roles {
type system: () => string;
type developer: () => string;
type assistant: () => string;
type reasoning: (_:{effort:ReasonEffort}) => string;
type user: () => string;
}
type ReasonEffort = "high" | "medium" | "low";<|eof|>
<|file|>roles.system<|stdout|>You are a helpful assistant.<|eof|>
<|file|>roles.user<|stdout|>What is the purpose of this code?<|eof|>
<|file|>roles.reasoning({"effort":"medium"})<|stdout|>To provide a conversation history with roles and messages.<|eof|>
<|file|>roles.assistant<|stdout|>This code defines a namespace with roles and a conversation history with system and user messages.<|eof|>
```

## usage

```ts
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
  Unison.Message.role_content("system", "You are a helpful assistant."),
  Unison.Message.role_content("user", "What is the purpose of this code?"),
  Unison.Message.role_content(
    `reasoning`,
    `To provide a conversation history with roles and messages.`
  ),
  Unison.Message.role_content(
    "assistant",
    "This code defines a namespace with roles and a conversation history with system and user messages."
  )
);
```
