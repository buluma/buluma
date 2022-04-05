import { readFileSync } from "fs";

export const importCss = () => `${readFileSync(
  "node_modules/tailwindcss/dist/tailwind.min.css"
).toString()}
${readFileSync("node_modules/react-vis/dist/style.css").toString()}`;
