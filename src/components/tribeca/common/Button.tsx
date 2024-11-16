import React, { useState } from "react";
import clsx from "clsx";

import { handleException } from "../../../utils/tribeca/error";
import { LoadingSpinner } from "./LoadingSpinner";

type Variant =
  | "outline"
  | "outline-danger"
  | "default"
  | "danger"
  | "primary"
  | "secondary"
  | "muted";

type Size = "sm" | "md" | undefined;

interface AdditionalButtonProps {
  size?: Size;
  variant?: Variant;
  icon?: boolean;
}

export interface ButtonProps
  extends Omit<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "onClick"
    >,
    AdditionalButtonProps {
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
  children?: React.ReactNode;
}

const variantStyles = {
  default: "border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:border-gray-300 text-gray-800",
  outline: "border hover:border-gray-200 text-gray-800 dark:text-white",
  primary: "text-black bg-primary shadow border border-primary-600",
  secondary: "text-white bg-accent shadow border border-accent-600",
  muted: "text-gray-200 bg-gray-700 hover:bg-gray-500",
  danger: "bg-red-500 text-black font-bold",
  "outline-danger": "border dark:text-white hover:text-red-500 hover:border-red-500 dark:hover:text-red-500 dark:hover:border-red-500"
};

const sizeStyles = {
  sm: "py-1.5 px-2 h-8 text-sm font-medium",
  md: "py-3 px-5 text-base rounded"
};

export function Button({
  children,
  disabled,
  className,
  onClick,
  size = "sm",
  variant = "default",
  icon = false,
  ...props
}: ButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <button
      {...props}
      onClick={
        onClick
          ? async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              setLoading(true);
              try {
                await onClick(e);
              } catch (e) {
                handleException(e, {
                  source: "button",
                });
              }
              setLoading(false);
            }
          : undefined
      }
      disabled={disabled || loading}
      className={clsx(
        // Base styles
        "flex flex-row items-center justify-center leading-normal",
        "rounded-sm",
        "text-sm font-semibold",
        "transform active:scale-98",
        "hover:bg-opacity-90",
        "transition-all",
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        // Icon styles
        icon && "rounded-full w-7 h-7 p-0",
        // Disabled styles
        "disabled:bg-gray-400 disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed",
        className
      )}
      style={{
        ...props.style,
      }}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          {children}
          <LoadingSpinner className="ml-2 mb-0.5" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
