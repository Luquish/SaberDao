import { navigate } from "@reach/router";
import React from 'react'

import { useParsedTX } from "@/hooks/tribeca/useParsedTX";
import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { TransactionProvider } from "./context";

interface TransactionViewProps {
  params: {
    transactionSeq: string;
  }
  children: React.ReactNode;
}

export const TransactionView: React.FC<TransactionViewProps> = ({ params, children }) => {
  const { key } = useSmartWallet();
  const transactionSeq = params.transactionSeq;
  const { data: parsedTX, isLoading } = useParsedTX(
    key,
    parseInt(transactionSeq ?? "0")
  );

  return (
    <div className="py-6">
      {isLoading && !parsedTX && <LoadingPage />}
      {parsedTX && (
        <>
          <TransactionProvider initialState={parsedTX}>
            {children}
          </TransactionProvider>
        </>
      )}
    </div>
  );
};
