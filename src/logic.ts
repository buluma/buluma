import * as core from "@actions/core";
import {
  createOrUpdateContent,
  getContent,
  getContext,
  createOrUpdateRelease,
} from "./io/github";
import { MetricsData, MetricsContext } from "./model";
import { updateTemplate } from "./template/updater";

const createOrUpdateMetrics = async (
  serializedData: string,
  key: string,
  value: string,
  releaseId: string,
  context: MetricsContext,
  path: string,
  existingSha: string
) => {
  let data: MetricsData;
  if (!serializedData) {
    core.info(`Saving new metrics for key "${key}"`);
    data = { key, type: "scalar", values: [] };
  } else {
    core.info(`Extending existing metrics for "${key}"`);
    data = JSON.parse(serializedData);
  }

  data.values.push({
    value: Number.parseFloat(value),
    releaseId,
  });

  await createOrUpdateContent(context, path, JSON.stringify(data), existingSha);
  return data;
};

export async function runAction() {
  try {
    const context = getContext();
    const key = core.getInput("key");
    const value = core.getInput("value");
    if (!key || Number.isNaN(Number.parseFloat(value))) {
      throw new Error(
        `Invalid arguments delivered: (key=${key}, value=${value})`
      );
    }
    const path = `data/values/${new Date().getUTCFullYear()}/${key}.json`;

    const [
      { releaseId, releaseYear },
      { serializedData, existingSha },
    ] = await Promise.all([
      createOrUpdateRelease(context),
      getContent(context, path),
    ]);

    await createOrUpdateMetrics(
      serializedData,
      key,
      value,
      releaseId,
      context,
      path,
      existingSha
    );
    await updateTemplate(context, releaseYear);

    core.info("Finished processing new metrics");
  } catch (err) {
    core.setFailed(err.message);
  }
}
