import { shortenAddress } from "@cardinal/namespaces";
import { utils } from "@project-serum/anchor";
import { usePubkey, useSail } from "@rockooor/sail";
import { getOrCreateATA, SPLToken, TOKEN_PROGRAM_ID, } from "@saberhq/token-utils";
import { TransactionInstruction } from "@solana/web3.js";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { useParseTokenAmount } from "../../../../hooks/useParseTokenAmount";
import { useSmartWallet } from "../../../../hooks/useSmartWallet";
import { useTokenAccounts } from "../../../../hooks/useTokenAccounts";
import { useWrapTx } from "../../../../hooks/useWrapTx";
import { MEMO_PROGRAM_ID } from "../../../../utils/constants";
import { AsyncButton } from "../../../common/AsyncButton";
import { InputText } from "../../../common/inputs/InputText";
import { InputTokenAmount } from "../../../common/inputs/InputTokenAmount";
import { BasicPage } from "../../../common/page/BasicPage";
export const WalletSendsView = () => {
    const { key } = useSmartWallet();
    const { data: tokenAccounts, isLoading: userIsLoading, isSuccess, } = useTokenAccounts(key);
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const isLoading = !isSuccess || userIsLoading;
    const [token, setToken] = useState(null);
    const [toStr, setToStr] = useState("");
    const [amountStr, setAmountStr] = useState("");
    const to = usePubkey(toStr);
    const amount = useParseTokenAmount(token, amountStr);
    const [memo, setMemo] = useState("");
    const tokenAccountsWithGreatestBalance = useMemo(() => {
        const mintBalanceMap = {};
        tokenAccounts?.forEach((tknAcc) => {
            const existingAcc = mintBalanceMap[tknAcc.balance.token.address];
            if (!existingAcc) {
                mintBalanceMap[tknAcc.balance.token.address] = tknAcc;
            }
            else {
                if (tknAcc.balance.greaterThan(existingAcc.balance)) {
                    mintBalanceMap[tknAcc.balance.token.address] = tknAcc;
                }
            }
        });
        return Object.values(mintBalanceMap);
    }, [tokenAccounts]);
    const selectedAccount = token
        ? tokenAccountsWithGreatestBalance?.find((t) => t?.balance.token.equals(token))
        : null;
    return (React.createElement(BasicPage, { title: "Send funds", description: "Send tokens to another account." },
        React.createElement("div", { tw: "p-4 w-full max-w-md mx-auto border rounded flex flex-col gap-4" },
            React.createElement("div", { tw: "rounded border p-4 bg-gray-50" },
                React.createElement(InputTokenAmount, { label: "Transfer Amount", isLoading: isLoading, tokens: tokenAccountsWithGreatestBalance
                        ?.filter((ta) => !ta.balance.isZero())
                        ?.map((ta) => ta?.balance.token)
                        .filter((t) => !!t) ?? [], onTokenSelect: setToken, token: token ?? null, inputValue: amountStr, inputOnChange: setAmountStr, currentAmount: selectedAccount
                        ? {
                            label: "Balance",
                            amount: selectedAccount.balance,
                            allowSelect: true,
                        }
                        : undefined })),
            React.createElement("div", { tw: "flex flex-col gap-2 text-sm" },
                React.createElement("span", { tw: "font-medium" }, "Recipient"),
                React.createElement(InputText, { type: "text", value: toStr, placeholder: `Recipient's address`, onChange: (e) => {
                        setToStr(e.target.value);
                    } })),
            React.createElement("div", { tw: "flex flex-col gap-2 text-sm" },
                React.createElement("span", { tw: "font-medium" }, "Memo (optional)"),
                React.createElement(InputText, { type: "text", value: memo, onChange: (e) => {
                        setMemo(e.target.value);
                    } })),
            React.createElement("div", null,
                React.createElement(AsyncButton, { variant: "primary", size: "md", tw: "w-full", disabled: !selectedAccount || !amount || !to, onClick: async (sdkMut) => {
                        invariant(selectedAccount && amount && to, "selected account");
                        const provider = sdkMut.provider;
                        const initTX = provider.newTX([]);
                        const destATA = await getOrCreateATA({
                            provider: sdkMut.provider,
                            mint: amount.token.mintAccount,
                            owner: to,
                        });
                        if (destATA.instruction) {
                            initTX.instructions.push(destATA.instruction);
                        }
                        const transferIX = SPLToken.createTransferCheckedInstruction(TOKEN_PROGRAM_ID, selectedAccount.account, amount.token.mintAccount, destATA.address, key, [], amount.toU64(), amount.token.decimals);
                        const sendTX = provider.newTX([
                            transferIX,
                            memo
                                ? new TransactionInstruction({
                                    programId: MEMO_PROGRAM_ID,
                                    keys: [],
                                    data: Buffer.from(utils.bytes.utf8.encode(memo)),
                                })
                                : null,
                        ]);
                        await handleTX(await wrapTx(initTX.combine(sendTX)), `Proposal: send ${amount.formatUnits()} to ${shortenAddress(to.toString())}`);
                    } }, "Send")))));
};
