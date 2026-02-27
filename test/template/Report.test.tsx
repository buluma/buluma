import * as React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import { Report } from "../../src/template/Report";
import { ChartGraphics } from "../../src/template/page";

dayjs.extend((localizedFormat as any).default || localizedFormat);

jest.mock("react-vis", () => {
  const React = require("react");
  const wrap =
    (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": name }, children);

  return {
    XYPlot: wrap("XYPlot"),
    XAxis: wrap("XAxis"),
    YAxis: wrap("YAxis"),
    HorizontalGridLines: wrap("HorizontalGridLines"),
    VerticalGridLines: wrap("VerticalGridLines"),
    VerticalBarSeries: wrap("VerticalBarSeries"),
  };
});

const context = {
  branch: "master",
  releaseId: "rel-a",
  owner: "buluma",
  repo: "repo",
  token: "token",
};

describe("Report", () => {
  it("Renders correctly", async () => {
    const div = prepareDom();

    const releasesMap = new Map();
    releasesMap.set("rel-a", 1);
    releasesMap.set("rel-b", 2);
    releasesMap.set("rel-x", 6);
    releasesMap.set("rel-y", 7);
    releasesMap.set("rel-z", 8);
    const graphics: ChartGraphics = new Map();
    graphics.set("key-a", {
      config: { description: "Key A" },
      data: {
        key: "key-a",
        type: "scalar",
        values: [
          { releaseId: "rel-a", value: 2 },
          { releaseId: "rel-b", value: 1 },
          { releaseId: "rel-x", value: -1 },
          { releaseId: "rel-y", value: -2 },
          { releaseId: "rel-z", value: -3 },
        ],
      },
    });
    graphics.set("key-b", {
      config: {},
      data: {
        key: "key-b",
        type: "scalar",
        values: [
          { releaseId: "rel-a", value: 1 },
          { releaseId: "rel-b", value: 1 },
        ],
      },
    });
    const root = createRoot(div);
    await act(async () => {
      root.render(
        <Report
          date={dayjs(1234567890987).toDate()}
          config={{
            groups: {
              ["General"]: {
                metrics: ["key-a", "key-b"],
                name: "General",
                description: "Desc",
              },
              ["Other"]: {
                metrics: ["key-b"],
                name: "Other",
              },
            },
            metrics: {
              ["key-a"]: { description: "Key A" },
              ["key-b"]: {},
            },
          }}
          context={context}
          graphics={graphics}
          releases={{
            releases: [
              { id: "rel-a", timestamp: 1 },
              { id: "rel-b", timestamp: 2 },
            ],
            year: 2022,
          }}
          releasesMap={releasesMap}
        />
      );
    });
    expect(div.textContent).toContain("Metrics");
    expect(div.textContent).toContain("key-a");
    expect(div.textContent).toContain("General");
  });

  it("Renders many releases correctly", async () => {
    const div = prepareDom();

    const releasesMap = new Map();
    const ids = new Array(40).fill(0).map((_, i) => i);
    ids.forEach((r) => releasesMap.set(`rel-${r}`, r));
    const graphics: ChartGraphics = new Map();
    graphics.set("key-a", {
      config: { description: "Key A" },
      data: {
        key: "key-a",
        type: "scalar",
        values: ids.map((i) => ({ releaseId: `rel-${i}`, value: i })),
      },
    });
    const root = createRoot(div);
    await act(async () => {
      root.render(
        <Report
          date={dayjs(1234567890987).toDate()}
          config={{
            groups: {
              ["General"]: {
                metrics: ["key-a"],
                name: "General",
                description: "Desc",
              },
            },
            metrics: {
              ["key-a"]: {},
            },
          }}
          context={context}
          graphics={graphics}
          releases={{
            releases: ids.map((i) => ({ id: `rel-${i}`, timestamp: i })),
            year: 2022,
          }}
          releasesMap={releasesMap}
        />
      );
    });
    expect(div.textContent).toContain("key-a");
    expect(div.textContent).toContain("p90");
  });
});

function prepareDom() {
  document.getElementsByTagName("html")[0].innerHTML = "";
  const div = document.createElement("div");
  document.body.appendChild(div);
  return div;
}
