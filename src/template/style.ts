import { readFileSync } from "fs";

export const importCss = () => `${readFileSync(
  "node_modules/tailwindcss/index.css"
).toString()}
${readFileSync("node_modules/react-vis/dist/style.css").toString()}`;
