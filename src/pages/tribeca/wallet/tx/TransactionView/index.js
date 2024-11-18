import React from 'react';
import { useParsedTX } from "../../../../../hooks/tribeca/useParsedTX";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { TransactionProvider } from "./context";
export const TransactionView = ({ params, children }) => {
    const { key } = useSmartWallet();
    const transactionSeq = params.transactionSeq;
    const { data: parsedTX, isLoading } = useParsedTX(key, parseInt(transactionSeq ?? "0"));
    return (React.createElement("div", { className: "py-6" },
        isLoading && !parsedTX && React.createElement(LoadingPage, null),
        parsedTX && (React.createElement(React.Fragment, null,
            React.createElement(TransactionProvider, { initialState: parsedTX }, children)))));
};
