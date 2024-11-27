import React from "react";

interface Props {
  email: string;
  phone: string;
  edit: () => void;
}

interface RowProps {
  value: string;
  placeholder: string;
}
const InfoRow: React.FC<RowProps> = ({ value, placeholder }: RowProps) => {
  if (value === "") {
    return <span tw="text-sm text-secondary">{placeholder}</span>;
  } else {
    return <span tw="text-sm text-white">{value}</span>;
  }
};

export const SubscriptionInfo: React.FC<Props> = ({
  email,
  phone,
  edit,
}: Props) => {
  return (
    <>
      <InfoRow value={email} placeholder={"No email address"} />
      <InfoRow
        value={phone === "" ? "" : `+1 ${phone}`}
        placeholder={"No phone number"}
      />
      <button tw="flex justify-start" onClick={edit}>
        <span tw="text-sm text-primary">Edit Information</span>
      </button>
    </>
  );
};
