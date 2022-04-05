type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const prepareMocks = <X, Y>(
  coreMock: RecursivePartial<X>,
  githubMock: RecursivePartial<Y>
) => {
  mockModule("@actions/core", coreMock);
  mockModule("@actions/github", githubMock);
  return { coreMock, githubMock };
};

const mockModule = <T>(name: string, module: T) => {
  jest.mock(name, () => module);
  require(name);
};
