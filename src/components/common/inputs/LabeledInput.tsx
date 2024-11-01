import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import tw from "twin.macro";

type CommonProps<T> = InputHTMLAttributes<T> & TextareaHTMLAttributes<T>;

export interface Props<T extends HTMLElement> extends CommonProps<T> {
  Component: React.FC<CommonProps<T>>;
  label?: string;
  error?: string;
  touched?: boolean;
  footer?: React.ReactNode;
}

export const LabeledInput = <T extends HTMLElement>({
  id,
  label,
  Component,
  error,
  touched,
  footer,
  ...commonProps
}: Props<T>) => {
  return (
    <label tw="flex flex-col gap-1" htmlFor={id}>
      {label && <span tw="text-sm">{label}</span>}
      <Component
        {...commonProps}
        id={id}
        css={[touched && error && tw`ring-1 ring-red-500`]}
      />
      {touched && error && <span tw="text-red-500 text-sm">{error}</span>}
      {footer !== undefined && <span tw="text-sm">{footer}</span>}
    </label>
  );
};
