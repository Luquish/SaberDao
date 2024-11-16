import React from "react";
import {
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import clsx from "clsx";

interface Props {
  className?: string;
  children?: React.ReactNode;
  type?: "warning" | "danger" | "info";
}

const COLORS = {
  warning: "#ffdc00",
  danger: "#ff0033",
  info: "#60a5fa", // Tailwind blue-400
} as const;

export function Alert({ className, children, type = "warning" }: Props) {
  const iconStyles = "h-6 w-6";
  
  return (
    <div 
      className={clsx(
        "grid gap-6 p-6 bg-warmGray-800 rounded text-gray-300",
        "grid-cols-[24px,1fr]",
        className
      )}
      style={{ borderTop: `4px solid ${COLORS[type]}` }}
    >
      {type === "info" && (
        <FaInfoCircle 
          className={iconStyles} 
          style={{ color: COLORS[type] }} 
        />
      )}
      {type === "warning" && (
        <FaExclamationTriangle 
          className={clsx(iconStyles, "mt-1")} 
          style={{ color: COLORS[type] }} 
        />
      )}
      {type === "danger" && (
        <FaExclamationCircle 
          className={clsx(iconStyles, "mt-1")} 
          style={{ color: COLORS[type] }} 
        />
      )}
      <div className="[&>h2]:text-base [&>h2]:leading-normal [&>h2]:mb-2 [&>h2]:font-semibold [&>h2]:text-white">
        {children}
      </div>
    </div>
  );
}
