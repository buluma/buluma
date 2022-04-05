import * as React from "react";

export const Page: React.FC<{}> = ({ children }) => (
  <div className="bg-gray-100 text-gray-900 flex p-4 justify-center">
    <div className="w-full max-w-6xl">{children}</div>
  </div>
);
