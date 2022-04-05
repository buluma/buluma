export type MetricsValue<T> = {
  value: T;
  releaseId: string;
};

export type MetricsData = {
  key: string;
  type: "scalar";
  values: Array<MetricsValue<number>>;
};

export type MetricsContext = {
  releaseId: string;
  token: string;
  repo: string;
  owner: string;
  branch: string;
};

export type Release = {
  id: string;
  timestamp: number;
};

export type ReleaseYear = {
  year: number;
  releases: Array<Release>;
};

export type ReleaseMap = Map<string, number>;

export type Config = {
  metrics: {
    [key: string]: MetricConfig;
  };
  groups: {
    [key: string]: {
      name: string;
      description?: string;
      metrics: Array<string>;
    };
  };
};

export type MetricConfig = {
  description?: string;
  max?: number;
  min?: number;
};
