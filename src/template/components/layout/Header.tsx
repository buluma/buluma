import * as React from "react";
import { ReleaseYear } from "../../../model";

export const Header: React.FC<{
  year: ReleaseYear;
  repo: string;
  owner: string;
}> = ({ year, repo, owner }) => (
  <h1 className="text-6xl mb-2">
    <span className="font-thin">
      {owner} / {repo} |
    </span>{" "}
    {year.year}
  </h1>
);
