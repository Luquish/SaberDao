import React from "react";

interface Props {
  label: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

export const FieldWrapper: React.FC<Props> = ({
  label,
  children,
  right,
}: Props) => {
  return (
    <div className="grid gap-3 grid-flow-row">
      <div className="text-gray-300 text-sm w-full flex justify-between">
        <label>{label}</label>
        <div>{right}</div>
      </div>
      <div>{children}</div>
    </div>
  );
};
