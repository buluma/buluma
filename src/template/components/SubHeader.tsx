import * as React from "react";

export const SubHeader: React.FC<{ header: string }> = ({ header }) => (
  <h2 className="text-xl mb-2 mt-8 font-bold">{header}</h2>
);
