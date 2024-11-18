import { usePubkey, useTokenAccount, useTokenAmount, useTXHandlers, } from "@rockooor/sail";
import { buildStubbedTransaction, mapN } from "@saberhq/solana-contrib";
import { createATAInstruction, getATAAddressSync, SPLToken, TOKEN_PROGRAM_ID, } from "@saberhq/token-utils";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { AsyncButton } from "../components/tribeca/common/AsyncButton";
import { InputText } from "../components/tribeca/common/inputs/InputText";
import { InputTokenAmount } from "../components/tribeca/common/inputs/InputTokenAmount";
import { useTokenAccounts } from "../hooks/tribeca/useTokenAccounts";
import { useWrapTx } from "../hooks/tribeca/useWrapTx";
import { serializeToBase64 } from "../utils/tribeca/makeTransaction";
import { useEnvironment } from "../utils/tribeca/useEnvironment";
import React from "react";
export const TransferTokensAction = ({ actor, setError, setTxRaw, }) => {
    const [token, setToken] = useState(null);
    const [amountStr, setAmountStr] = useState("");
    const [destinationStr, setDestinationStr] = useState("");
    const { network } = useEnvironment();
    const amount = useTokenAmount(token, amountStr);
    const recipient = usePubkey(destinationStr);
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    const treasuryATAKey = mapN((token) => getATAAddressSync({ mint: token?.mintAccount, owner: actor }), token);
    const recipientATAKey = mapN((token, recipient) => getATAAddressSync({ mint: token?.mintAccount, owner: recipient }), token, recipient);
    const { data: treasuryATA } = useTokenAccount(treasuryATAKey);
    const { data: recipientATA } = useTokenAccount(recipientATAKey);
    const { data: treasuryTokenAccounts } = useTokenAccounts(actor);
    const allTokens = treasuryTokenAccounts
        ?.map((ta) => ta?.balance.token)
        .filter((t) => !!t) ?? [];
    const selectedAccount = token
        ? treasuryTokenAccounts?.find((t) => t?.balance.token.equals(token))
        : null;
    useEffect(() => {
        if (!treasuryATA || !recipientATA || !actor || !amount) {
            return;
        }
        const ixs = [
            SPLToken.createTransferInstruction(TOKEN_PROGRAM_ID, treasuryATA.publicKey, recipientATA.publicKey, actor, [], amount.toU64()),
        ];
        try {
            const txStub = buildStubbedTransaction(network !== "localnet" ? network : "devnet", ixs);
            setTxRaw(serializeToBase64(txStub));
            setError(null);
        }
        catch (ex) {
            setTxRaw("");
            console.debug("Error issuing tokens", ex);
            setError("Error generating proposal");
        }
    }, [actor, amount, network, recipientATA, setError, setTxRaw, treasuryATA]);
    return (React.createElement(React.Fragment, null,
        React.createElement(InputTokenAmount, { label: "Amount", token: token, onTokenSelect: setToken, tokens: allTokens, className: "h-auto", inputValue: amountStr, inputDisabled: !actor, inputOnChange: (e) => {
                setAmountStr(e);
            }, currentAmount: selectedAccount
                ? {
                    label: "Treasury Balance",
                    amount: selectedAccount.balance,
                    allowSelect: true,
                }
                : undefined }),
        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "source" },
            React.createElement("span", { className: "text-sm" }, "Sender"),
            React.createElement(InputText, { id: "source", value: actor.toString(), disabled: true })),
        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "destination" },
            React.createElement("span", { className: "text-sm" }, "Recipient"),
            React.createElement(InputText, { id: "destination", placeholder: "Address to give tokens to.", value: destinationStr, onChange: (e) => {
                    setDestinationStr(e.target.value);
                } })),
        recipientATA === null && recipientATAKey && (React.createElement(AsyncButton, { disabled: !actor || !token || !recipient || !recipientATAKey, onClick: async (sdkMut) => {
                invariant(actor && token && recipient && recipientATAKey);
                await signAndConfirmTX(await wrapTx(sdkMut.provider.newTX([
                    createATAInstruction({
                        address: recipientATAKey,
                        mint: token.mintAccount,
                        owner: recipient,
                        payer: sdkMut.provider.walletKey,
                    }),
                ])), "Create token accounts");
            } }, "Create token accounts"))));
};
