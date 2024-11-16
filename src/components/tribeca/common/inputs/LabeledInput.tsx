import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import React from "react";

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
    <label className="flex flex-col gap-1" htmlFor={id}>
      {label && <span className="text-sm">{label}</span>}
      <Component
        {...commonProps}
        id={id}
        className={`${touched && error && "ring-1 ring-red-500"}`}
      />
      {touched && error && <span className="text-red-500 text-sm">{error}</span>}
      {footer !== undefined && <span className="text-sm">{footer}</span>}
    </label>
  );
};
