import { safeDump } from "js-yaml";
import { toBase64 } from "../../src/io/encoding";
import { ReleaseYear, MetricsData, Config } from "../../src/model";

export const getOctokit = () => ({
  repos: {
    createOrUpdateFileContents: async () => {},
    ...mockAnswer([]),
  },
});

export const context = {
  repo: {
    repo: "repo",
    owner: "owner",
  },
  sha: "rel-a",
  ref: "master",
};

export const createAnswer = (serializedData: string) => ({
  status: 200,
  data: {
    content: toBase64(serializedData),
    sha: "abc",
  },
});

export const mockAnswer = (
  answer?: Array<{ key: string; content: string | null }>
) => ({
  getContent: async (arg) => {
    const year = new Date().getFullYear();
    const mockAnswers = {
      [`data/releases/${year}/releases.json`]: () => {
        const year: ReleaseYear = {
          year: new Date().getFullYear(),
          releases: [
            { timestamp: 1, id: "rel-a" },
            { timestamp: 2, id: "rel-b" },
          ],
        };
        return createAnswer(JSON.stringify(year));
      },
      [`.github/repo-monitor-action/config.yml`]: () => {
        const config: Config = {
          metrics: {
            ["key-a"]: {
              description:
                "Allow only a smaller spectrum of percentages. For safety reasons.",
              max: 95,
              min: 70,
            },
            ["key-b"]: {},
            ["key-non-relevant"]: {
              description: "Not shown in any group",
            },
          },
          groups: {
            ["general"]: {
              name: "General",
              description: "This group includes all important metrics",
              metrics: ["key-a", "key-x"],
            },
            ["specific"]: {
              name: "General",
              description: "This group has additionally key-b",
              metrics: ["key-a", "key-b"],
            },
          },
        };
        return createAnswer(safeDump(config));
      },
      [`data/values/${year}/key-a.json`]: () => {
        const data: MetricsData = {
          key: "key-a",
          type: "scalar",
          values: [{ value: 1, releaseId: "rel-a" }],
        };
        return createAnswer(JSON.stringify(data));
      },
      [`data/values/${year}/key-b.json`]: () => {
        const data: MetricsData = {
          key: "key-b",
          type: "scalar",
          values: [
            { value: 1, releaseId: "rel-a" },
            { value: -2, releaseId: "rel-b" },
          ],
        };
        return createAnswer(JSON.stringify(data));
      },
      [`index.html`]: () => {
        return createAnswer("");
      },
    };
    answer.forEach((a) => {
      mockAnswers[a.key] = () => createAnswer(a.content);
    });
    const sendAnswer = mockAnswers[arg.path];
    if (!sendAnswer) {
      return {
        status: 404,
      };
    } else {
      return sendAnswer() || { status: 404 };
    }
  },
});
