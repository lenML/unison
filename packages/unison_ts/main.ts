export namespace Unison {
  type IFile = { name: string; content: string };
  type IType = { name: string; type: string; comment?: string };

  export class Root {
    static eof_newline = true;

    static readonly tokens = {
      file: "<|file|>",
      stdout: "<|stdout|>",
      eof: "<|eof|>",
    } as const;

    static head(name: string) {
      const { file: _f } = this.tokens;
      return `${_f}${name}`;
    }

    static out(content: string) {
      const { stdout: _o } = this.tokens;
      return `${_o}${content}`;
    }

    static file({ name, content }: IFile): string {
      return this.files([`${this.head(name)}${this.out(content)}`]);
    }

    static files(items: string[]) {
      const { eof: _e } = this.tokens;
      const end = _e + (this.eof_newline ? "\n" : "");
      return items.map((x) => x + (x.endsWith(end) ? "" : end)).join("");
    }
  }

  export class NS {
    static ns(name: string, types: IType[]) {
      return `declare namespace ${name} {\n${types
        .map((x) =>
          `${
            x.comment
              ? x.comment
                  .split("\n")
                  .map((y) => `// ${y}`)
                  .join("\n")
              : ""
          }\ntype ${x.name}: ${x.type};`.trim()
        )
        .join("\n")}\n}`;
    }
    static type(
      name: string,
      type: string = "() => string",
      comment?: string
    ): IType {
      return { name, type, comment };
    }
  }

  export class File {
    static file(name: string, content: string): IFile {
      return { name, content };
    }
  }

  export enum ERole {
    system = "system",
    developer = "developer",
    assistant = "assistant",
    reasoning = "reasoning",
    user = "user",
  }
  const roles = {
    [ERole.system]: () => "roles.system",
    [ERole.developer]: () => "roles.developer",
    [ERole.assistant]: () => "roles.assistant",
    [ERole.reasoning]: (effort = "medium") =>
      `roles.reasoning(${JSON.stringify({ effort })})`,
    [ERole.user]: () => "roles.user",
  } as const;

  export class Message {
    static role_content(role: string, content: string, payload?: any) {
      let name = roles[role]?.(payload) || role;
      return { name, content } as IFile;
    }

    static render(msg: IFile) {
      return Root.file(msg);
    }
  }

  export class Conversation {
    static completion(
      files: IFile[] = [],
      next: string = ERole.assistant,
      payload?: any
    ) {
      const { stdout: _o } = Root.tokens;
      let name: any = next;
      return `${this.history(...files)}${Root.head(
        roles[name]?.(payload) || name
      )}${_o}`;
    }

    static history(...files: IFile[]) {
      const { stdout: _o } = Root.tokens;
      return `${Root.files([...files.map((x) => Root.file(x))])}`;
    }

    static from_messages(
      messages: { role: string; content: string; payload?: any }[]
    ) {
      return messages.map((x) =>
        Message.role_content(x.role, x.content, x.payload)
      );
    }
  }

  export class Parser {
    static normalize(content: string) {
      return content.replace(/\r\n/g, "\n");
    }

    static parse(content: string): IFile[] {
      content = this.normalize(content);
      const { file: _f, stdout: _o, eof: _e } = Root.tokens;
      const [fl, ol, el] = [_f.length, _o.length, _e.length];
      const files = [] as IFile[];
      let start = content.indexOf(_f);
      let cursor = start;
      while (cursor < content.length) {
        const idx_out = content.indexOf(_o, cursor);
        const idx_end = content.indexOf(_e, idx_out + ol);
        const name = content.slice(cursor + fl, idx_out);
        const out = content.slice(idx_out + ol, idx_end);
        files.push({ name, content: out });
        cursor = idx_end + el;
        if (content[cursor] === "\n") {
          cursor += 1;
        }
      }
      return files;
    }
  }

  export namespace Defaults {
    export namespace Simple {
      export const roles = NS.ns("roles", [
        NS.type(
          "system",
          "() => string",
          "A system message, meta information like knowledge cutoff, etc."
        ),
        NS.type(
          "developer",
          "() => string",
          "The developer message is used to provide information about the instructions for the model (what is normally considered the “system prompt”) and available function tools."
        ),
        NS.type(
          "assistant",
          "() => string",
          "Output by the model which can either be a tool call or a message output. The output might also be associated with a particular “channel” identifying what the intent of the message is."
        ),
        NS.type(
          "user",
          "() => string",
          "Typically representing the input to the model."
        ),
      ]);
      export const envDts: IFile = {
        name: "env.d.ts",
        content: roles,
      };
    }
    export namespace Reasoner {
      export const roles = NS.ns("roles", [
        NS.type(
          "system",
          "() => string",
          "A system message, meta information like knowledge cutoff, etc."
        ),
        NS.type(
          "developer",
          "() => string",
          "The developer message is used to provide information about the instructions for the model (what is normally considered the “system prompt”) and available function tools."
        ),
        NS.type(
          "assistant",
          "() => string",
          "Output by the model which can either be a tool call or a message output. The output might also be associated with a particular “channel” identifying what the intent of the message is."
        ),
        NS.type(
          "reasoning",
          "(_: { effort: ReasonEffort }) => string",
          "model's inner monologue and involves deep, step-by-step chain of thought (CoT). The strength of the reasoning effort should be determined before output."
        ),
        NS.type(
          "user",
          "() => string",
          "Typically representing the input to the model."
        ),
      ]);
      export const effortType = `type ReasonEffort = "high" | "medium" | "low" | \`max \${number} tokens\` | \`min \${number} tokens\`;`;
      export const envDts: IFile = {
        name: "env.d.ts",
        content: roles + `\n${effortType}`,
      };
    }
    export namespace PreTraining {
      export const roles = NS.ns("roles", [
        NS.type(
          "metadata",
          "() => string",
          "Metadata about the training data, such as the source, date, and any other relevant information."
        ),
        NS.type(
          "text",
          "() => string",
          "A text message, typically representing the training data to the model."
        ),
      ]);
      export const envDts: IFile = {
        name: "env.d.ts",
        content: roles,
      };
    }
  }
}
