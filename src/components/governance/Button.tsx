import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";

import { handleException } from "@/utils/governance/error";
import { LoadingSpinner } from "@/components/governance/LoadingSpinner";

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

/**
 * A button.
 * @returns
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  className,
  onClick,
  ...props
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <StyledButton
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={
        onClick
          ? async (e) => {
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
      className={className}
      style={{
        ...props.style,
      }}
    >
      {loading ? (
        <div tw="flex items-center gap-2">
          {children}
          <LoadingSpinner tw="ml-2 mb-0.5" />
        </div>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export const StyledButton = styled.button<AdditionalButtonProps>(
  ({ size = "sm", variant = "default", icon }) => [
    tw`flex flex-row items-center justify-center leading-normal`,
    tw`rounded-sm`,
    tw`text-sm font-semibold`,
    tw`transform active:scale-90 text-gray-800 hover:bg-opacity-90`,
    tw`transition-all`,
    {
      default: tw`border border-gray-200 bg-white shadow-sm hover:(bg-gray-100 border-gray-300) transition-colors`,
      outline: tw`border hover:border-gray-200 transition-colors text-gray-800 dark:text-white`,
      primary: tw`text-black bg-gray-50 shadow border border-gray-600`,
      secondary: tw`text-white bg-center shadow border border-amber-600`,
      muted: tw`text-gray-200 bg-gray-700 hover:bg-gray-500`,
      danger: tw`bg-red-500 text-black font-bold`,
      "outline-danger": tw`border dark:text-white hover:dark:text-red-500 hover:dark:border-red-500`,
    }[variant],
    tw`disabled:(bg-gray-400 border-gray-600 text-gray-600 cursor-not-allowed)`,

    size === "sm" && tw`py-1.5 px-2 h-8 text-sm font-medium`,
    size === "md" && tw`py-3 px-5 text-base rounded`,

    icon && tw`rounded-full w-7 h-7 p-0!`,
  ]
);
