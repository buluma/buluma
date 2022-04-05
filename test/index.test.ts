import { prepareMocks } from "./utils/mocks";
import * as core from "./utils/actions-core";
import * as github from "./utils/actions-github";
import { mockAnswer } from "./utils/actions-github";

describe("General", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("Should run full process", async () => {
    // given
    const { coreMock } = prepareMocks(core, github);

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(0);
    expect(coreMock.error.mock.calls.length).toBe(0);
    expect(coreMock.info.mock.calls).toContainEqual([
      "Using existing release rel-a",
    ]);
    expect(coreMock.info.mock.calls).toContainEqual([
      'Extending existing metrics for "key-a"',
    ]);
    expect(
      coreMock.info.mock.calls.filter((n) => n[0].startsWith("Reduced CSS 9"))
    ).toBeTruthy();
  });

  it("Should fail with invalid config", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: ".github/repo-monitor-action/config.yml",
                content: "asd:asf:asd",
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "Configuration is missing metrics or groups on root level",
    ]);
  });

  it("Should fail with missing config", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: ".github/repo-monitor-action/config.yml",
                content: null,
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "No config provided at .github/repo-monitor-action/config.yml on master",
    ]);
  });

  it("Should fail with missing key", async () => {
    // given
    const { coreMock } = prepareMocks(
      {
        ...core,
        getInput: (key: string) => {
          if (key === "token") {
            return "SECRET";
          } else if (key === "key") {
            return "key-a";
          } else {
            return undefined;
          }
        },
      },
      github
    );

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "Invalid arguments delivered: (key=key-a, value=undefined)",
    ]);
  });

  it("Should fail with missing value", async () => {
    // given
    const { coreMock } = prepareMocks(
      {
        ...core,
        getInput: (key: string) => {
          if (key === "token") {
            return "SECRET";
          } else if (key === "value") {
            return "1";
          } else {
            return undefined;
          }
        },
      },
      github
    );

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "Invalid arguments delivered: (key=undefined, value=1)",
    ]);
  });

  it("Should create new value", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: `data/values/${new Date().getFullYear()}/key-a.json`,
                content: null,
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(0);
    expect(coreMock.info.mock.calls).toContainEqual([
      'Saving new metrics for key "key-a"',
    ]);
  });

  it("Should create new release year", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: `data/releases/${new Date().getFullYear()}/releases.json`,
                content: null,
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(0);
    expect(coreMock.info.mock.calls).toContainEqual([
      `Creating year ${new Date().getFullYear()} for new release`,
    ]);
    expect(coreMock.info.mock.calls).toContainEqual(["Saved release rel-a"]);
  });

  it("Should create new release for existing year", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: `data/releases/${new Date().getFullYear()}/releases.json`,
                content: JSON.stringify({
                  year: new Date().getFullYear(),
                  releases: [
                    { timestamp: 1, id: "rel-x" },
                    { timestamp: 2, id: "rel-y" },
                  ],
                }),
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(0);
    expect(coreMock.info.mock.calls).toContainEqual(["Saved release rel-a"]);
  });
});
