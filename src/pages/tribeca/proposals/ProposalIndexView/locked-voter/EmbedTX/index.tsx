import type { PublicKey } from "@solana/web3.js";
import React from "react";

import { useParsedTXByKey } from "@/hooks/tribeca/useParsedTX";
import { SmartWalletProvider } from "@/hooks/tribeca/useSmartWallet";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import { TransactionProvider } from "@/contexts/tribeca/transaction";
import InstructionsInner from "./InstructionsInner";

interface Props {
  txKey: PublicKey;
}

const EmbedTX: React.FC<Props> = ({ txKey }: Props) => {
  const { data: parsedTX, isLoading } = useParsedTXByKey(txKey);
  return (
    <div className="py-6">
      {isLoading && !parsedTX && <LoadingPage />}
      {parsedTX && (
        <SmartWalletProvider initialState={parsedTX.tx.account.smartWallet}>
          <TransactionProvider initialState={parsedTX}>
            <InstructionsInner />
          </TransactionProvider>
        </SmartWalletProvider>
      )}
    </div>
  );
};

export default EmbedTX;
