import React from "react";
import { usePubkey } from "@rockooor/sail";
import { PageProps } from "gatsby";

import { SmartWalletProvider } from "@/hooks/tribeca/useSmartWallet";
import SmartWalletInner from "./SmartWalletInner";

interface WalletParams {
  walletKey: string;
}

const WalletIndexView: React.FC<PageProps<object, WalletParams>> = ({ params }) => {
  const walletKey = usePubkey(params.walletKey);

  if (!walletKey) {
    return <div>Invalid wallet key</div>;
  }

  return (
    <SmartWalletProvider initialState={walletKey}>
      <SmartWalletInner />
    </SmartWalletProvider>
  );
};

export default WalletIndexView;
