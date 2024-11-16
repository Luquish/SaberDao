import React from "react";

function getColor(variant: Props["variant"]) {
  switch (variant) {
    case "error":
      return "rgb(239, 68, 68)"; // red-500
    case "warn":
      return "rgb(234, 179, 8)"; // yellow-500
    case "muted":
      return "rgb(107, 114, 128)"; // gray-500
    default:
      return "rgb(59, 130, 246)"; // blue-500
  }
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "muted" | "error" | "warn";
}

export const HelperCard: React.FC<Props> = ({
  children,
  variant = "primary",
  className,
}: Props) => {
  return (
    <div
      className={`px-4 py-2 rounded border text-sm ${className}`}
      style={{
        border: `1px solid ${getColor(variant)}`,
        backgroundColor: `${getColor(variant)}20`,
        color: `${getColor(variant)}100`,
      }}
    >
      {children}
    </div>
  );
};
