import React from "react";
import { FaEnvelope, FaMobileAlt } from "react-icons/fa";

import { Button } from "../../../../common/Button";
import { IconInput } from "./IconInput";

export interface Props {
  inputDisabled: boolean;
  email: string;
  submitDisabled: boolean;
  submitLabel: string;
  phone: string;
  warningMessage?: string;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  submit: () => void;
}

export const SubscriptionForm: React.FC<Props> = ({
  email,
  inputDisabled,
  submitDisabled,
  submitLabel,
  phone,
  warningMessage,
  setEmail,
  setPhone,
  submit,
}: Props) => {
  return (
    <>
      <IconInput
        disabled={inputDisabled}
        icon={<FaEnvelope />}
        tw="pl-8"
        name="email"
        type="email"
        onChange={(e) => {
          setEmail(e.target.value ?? "");
        }}
        placeholder="Email Address"
        value={email}
      />
      <IconInput
        disabled={inputDisabled}
        icon={
          <>
            <FaMobileAlt />
            <span tw="py-2 text-sm ml-1 text-secondary">+1</span>
          </>
        }
        tw="pl-12"
        name="phone"
        type="tel"
        onChange={(e) => {
          setPhone(e.target.value ?? "");
        }}
        placeholder="Phone Number"
        value={phone}
      />
      {warningMessage ? (
        <div tw="text-red-500 text-xs">
          <span>{warningMessage}</span>
        </div>
      ) : null}
      <Button
        disabled={submitDisabled}
        variant="primary"
        tw="text-base align-self[center] font-semibold px-10 py-6 mt-2 mb-4 hover:(bg-white text-black)"
        onClick={submit}
      >
        <span>{submitLabel}</span>
      </Button>
    </>
  );
};
