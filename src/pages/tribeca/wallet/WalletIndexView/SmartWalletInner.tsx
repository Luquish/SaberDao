import React from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";


export const SmartWalletInner: React.FC = () => {
  const { smartWallet } = useSmartWallet();

  return (
    <div>{smartWallet?.data?.owners.map((o) => o.toString()).join(",")}</div>
  );
};
