import * as React from "react";
import * as dayjs from "dayjs";

import { SubHeader } from "./SubHeader";
import { ReleaseYear, ReleaseMap } from "../../model";

const MAX_ITEMS = 10;

export const Releases: React.FC<{
  year: ReleaseYear;
  releasesMap: ReleaseMap;
}> = ({ year, releasesMap }) => {
  const newestReleases = year.releases
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_ITEMS);

  return (
    <div>
      <SubHeader header="Releases" />
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-800 text-gray-100">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Commit</th>
          </tr>
        </thead>
        <tbody>
          {newestReleases.map((n, i) => (
            <tr
              key={`r-${i}`}
              className={i % 2 == 0 ? "bg-gray-200" : "bg-gray-300"}
            >
              <td className="px-4 py-2">{releasesMap.get(n.id)}</td>
              <td className="px-4 py-2">{dayjs(n.timestamp).format("lll")}</td>
              <td className="px-4 py-2">{n.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {MAX_ITEMS < year.releases.length ? (
        <p className="mt-4">
          Only last {MAX_ITEMS} releases displayed, year has{" "}
          {year.releases.length} in total.
        </p>
      ) : null}
    </div>
  );
};
