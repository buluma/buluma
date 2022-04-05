export const roundNumber = (value: number, precision: number) =>
  Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision);

export const calcMin = (values: Array<number>) =>
  values.reduce((a, b) => (a < b ? a : b), 0);

export const calcMax = (values: Array<number>) =>
  values.reduce((a, b) => (a > b ? a : b), 0);

export const calcAvg = (values: Array<number>) =>
  values.reduce((a, b) => a + b, 0) / values.length;

export const calcPercentile = (values: Array<number>, percentile: number) => {
  const sorted = values.sort();
  const index = values.length * (percentile / 100);
  const lowerBound = Math.floor(index);
  const upperBound = Math.ceil(index);
  return (sorted[lowerBound] + sorted[upperBound]) / 2;
};
