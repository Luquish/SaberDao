import { Outlet, useParams } from "react-router-dom";

import { useParsedTX } from "../../../../../hooks/useParsedTX";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { LoadingPage } from "../../../../common/LoadingPage";
import { TransactionProvider } from "./context";

export const TransactionView: React.FC = () => {
  const { key } = useSmartWallet();
  const { transactionSeq } = useParams<"transactionSeq">();
  const { data: parsedTX, isLoading } = useParsedTX(
    key,
    parseInt(transactionSeq ?? "0")
  );
  return (
    <div tw="py-6">
      {isLoading && !parsedTX && <LoadingPage />}
      {parsedTX && (
        <>
          <TransactionProvider initialState={parsedTX}>
            <Outlet />
          </TransactionProvider>
        </>
      )}
    </div>
  );
};
