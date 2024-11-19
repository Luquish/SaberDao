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
function InfoRow({ value, placeholder }: RowProps) {
  if (value === "") {
    return <span className="text-sm text-secondary">{placeholder}</span>;
  } else {
    return <span className="text-sm text-white">{value}</span>;
  }
};

export default function SubscriptionInfo({
  email,
  phone,
  edit,
}: Props) {
  return (
    <>
      <InfoRow value={email} placeholder={"No email address"} />
      <InfoRow
        value={phone === "" ? "" : `+1 ${phone}`}
        placeholder={"No phone number"}
      />
      <button className="flex justify-start" onClick={edit}>
        <span className="text-sm text-primary">Edit Information</span>
      </button>
    </>
  );
};
