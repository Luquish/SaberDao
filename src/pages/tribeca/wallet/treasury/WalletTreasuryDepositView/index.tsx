import { RouteComponentProps } from '@reach/router';
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { EmptyStateConnectWallet } from "@/components/tribeca/common/EmptyState";
import BasicPage from "@/components/tribeca/common/page/BasicPage";
import WalletTreasuryDepositInner from "./WalletTreasuryDepositInner";
import React from "react";

const WalletTreasuryDepositView: React.FC<RouteComponentProps> = () => {
  const wallet = useAnchorWallet();
  return (
    <BasicPage
      title="Deposit funds"
      description="Deposit tokens into your wallet's treasury."
    >
      {!wallet ? <EmptyStateConnectWallet /> : <WalletTreasuryDepositInner />}
    </BasicPage>
  );
};

export default WalletTreasuryDepositView;
