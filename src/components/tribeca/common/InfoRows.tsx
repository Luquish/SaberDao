import React from "react";

interface Props {
  rows: Record<string, React.ReactNode>;
}

export const InfoRows: React.FC<Props> = ({ rows }: Props) => {
  return (
    <div className="grid gap-3">
      {Object.entries(rows).map(([label, value]) => (
        <div key={label} className="text-xs flex items-start justify-between">
          <div className="lowercase text-secondary">{label}</div>
          <div className="text-gray-800">{value}</div>
        </div>
      ))}
    </div>
  );
};
