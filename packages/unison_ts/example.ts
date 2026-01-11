import { Unison } from "./main";
import fs from "fs";
import path from "path";

const envDts = fs.readFileSync(
  path.join(process.cwd(), "../../example/env.d.ts"),
  "utf-8"
);
const toolsDts = fs.readFileSync(
  path.join(process.cwd(), "../../example/tools.d.ts"),
  "utf-8"
);
const files = [
  {
    name: "env.d.ts",
    content: Unison.Parser.normalize(envDts),
  },
  {
    name: "tools.d.ts",
    content: Unison.Parser.normalize(toolsDts),
  },
  ...Unison.Parser.parse(
    fs.readFileSync(
      path.join(process.cwd(), "../../example/snapshot.txt"),
      "utf-8"
    )
  ),
];

// output to json file
fs.writeFileSync("./example.json", JSON.stringify(files, null, 2));
// output to real content
fs.writeFileSync("./example.txt", Unison.Conversation.history(...files));

console.log("done");
