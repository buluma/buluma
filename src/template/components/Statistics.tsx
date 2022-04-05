import * as React from "react";
import {
  roundNumber,
  calcMin,
  calcMax,
  calcAvg,
  calcPercentile,
} from "../../util/math";

const StatsTable: React.FC<{}> = ({ children }) => (
  <div>
    <table className="table-auto w-full text-left">
      <tbody>{children}</tbody>
    </table>
  </div>
);

const StatsLine: React.FC<{ name: string; value: number }> = ({
  name,
  value,
}) => (
  <tr>
    <td className="w-1/3">{name}:</td>
    <td className="w-2/3">
      {Number.isNaN(value) ? "-" : roundNumber(value, 3)}
    </td>
  </tr>
);

export const Statistics: React.FC<{ values: Array<number> }> = ({ values }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
    <StatsTable>
      <StatsLine name="Max" value={calcMax(values)} />
      <StatsLine name="Min" value={calcMin(values)} />
      <StatsLine name="Avg" value={calcAvg(values)} />
    </StatsTable>
    <StatsTable>
      <StatsLine name="p10" value={calcPercentile(values, 10)} />
      <StatsLine name="p25" value={calcPercentile(values, 25)} />
      <StatsLine name="p50" value={calcPercentile(values, 50)} />
      <StatsLine name="p75" value={calcPercentile(values, 75)} />
      <StatsLine name="p90" value={calcPercentile(values, 90)} />
    </StatsTable>
  </div>
);
