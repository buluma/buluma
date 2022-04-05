export const info = jest.fn();
export const error = jest.fn();
export const warning = jest.fn();
export const setFailed = jest.fn();
export const getInput = (key: string) => {
  if (key === "token") {
    return "SECRET";
  } else if (key === "key") {
    return "key-a";
  } else if (key === "value") {
    return "1";
  } else {
    return undefined;
  }
};
