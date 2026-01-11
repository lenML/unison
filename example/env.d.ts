declare namespace roles {
  // A system message, meta information like knowledge cutoff, etc.
  type system = () => string;
  // The developer message is used to provide information about the instructions for the model (what is normally considered the “system prompt”) and available function tools.
  type developer = () => string;
  // Output by the model which can either be a tool call or a message output. The output might also be associated with a particular “channel” identifying what the intent of the message is.
  type assistant = () => string;
  // model's inner monologue and involves deep, step-by-step chain of thought (CoT). The strength of the reasoning effort should be determined before output.
  type reasoning = (_: { effort: ReasonEffort }) => string;
  // Typically representing the input to the model.
  type user = () => string;
} // namespace roles

type ReasonEffort =
  | "high"
  | "medium"
  | "low"
  | `max ${number} tokens`
  | `min ${number} tokens`;
