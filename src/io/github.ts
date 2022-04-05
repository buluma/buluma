import * as core from "@actions/core";
import * as github from "@actions/github";
import { MetricsContext, Release, ReleaseYear } from "../model";
import { fromBase64, toBase64 } from "./encoding";

export async function getContent(
  context: MetricsContext,
  path: string
): Promise<{ serializedData: string | null; existingSha: string | null }> {
  const { token, owner, repo, branch } = context;
  try {
    const octokit = github.getOctokit(token);
    const res = await octokit.repos.getContent({
      owner,
      repo,
      ref: branch,
      branch,
      path,
    });
    if (res?.status == 200) {
      return {
        serializedData: fromBase64(res.data.content),
        existingSha: res.data.sha,
      };
    } else {
      core.warning(`Unexpected response code ${res?.status} for ${path}`);
    }
  } catch (err) {
    core.error(
      `Reading from ${path} on ${context.branch} failed: ${err.message}`
    );
  }
  return { existingSha: null, serializedData: null };
}

export async function createOrUpdateContent(
  context: MetricsContext,
  path: string,
  content: string,
  existingSha: string | null
) {
  const { token, owner, repo, branch } = context;
  const octokit = github.getOctokit(token);
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    branch,
    path,
    content: toBase64(content),
    sha: existingSha || undefined,
    message: existingSha ? "Updated metrics" : "Created metrics",
  });
}

export function getContext() {
  const token = core.getInput("token");
  const { owner, repo } = github.context.repo;
  const { sha: releaseId } = github.context;
  const context: MetricsContext = {
    releaseId,
    token,
    owner,
    repo,
    branch: "gh-pages",
  };
  return context;
}

export async function createOrUpdateRelease(context: MetricsContext) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const path = `data/releases/${year}/releases.json`;
  const { existingSha, serializedData } = await getContent(context, path);
  let releaseYear: ReleaseYear;
  if (!serializedData) {
    core.info(`Creating year ${year} for new release`);
    releaseYear = { releases: [], year };
  } else {
    releaseYear = JSON.parse(serializedData);
    core.info(
      `Extending year ${year} with ${releaseYear.releases.length} existing releases`
    );
  }

  let usedRelease: Release | undefined = releaseYear.releases.find(
    (n) => n.id === context.releaseId
  );
  if (!usedRelease) {
    usedRelease = {
      id: context.releaseId,
      timestamp: now.getTime(),
    };
    releaseYear.releases.push(usedRelease);

    await createOrUpdateContent(
      context,
      path,
      JSON.stringify(releaseYear),
      existingSha
    );

    core.info(`Saved release ${usedRelease.id}`);
  } else {
    core.info(`Using existing release ${usedRelease.id}`);
  }

  return { releaseYear, releaseId: usedRelease.id };
}
