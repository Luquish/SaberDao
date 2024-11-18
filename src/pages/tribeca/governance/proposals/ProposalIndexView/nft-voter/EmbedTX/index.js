import { useParsedTXByKey } from "@/hooks/useParsedTX";
import { SmartWalletProvider } from "@/hooks/useSmartWallet";
import { LoadingPage } from "@/common/LoadingPage";
import { TransactionProvider } from "../../../../../wallet/tx/TransactionView/context";
import { InstructionsInner } from "./InstructionsInner";
export const EmbedTX = ({ txKey }) => {
    const { data: parsedTX, isLoading } = useParsedTXByKey(txKey);
    return (React.createElement("div", { tw: "py-6" },
        isLoading && !parsedTX && React.createElement(LoadingPage, null),
        parsedTX && (React.createElement(SmartWalletProvider, { initialState: parsedTX.tx.account.smartWallet },
            React.createElement(TransactionProvider, { initialState: parsedTX },
                React.createElement(InstructionsInner, null))))));
};
