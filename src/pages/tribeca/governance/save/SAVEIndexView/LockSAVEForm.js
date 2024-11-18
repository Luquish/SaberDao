import { useToken, useUserATAs, useTXHandlers, useTokenAmount, } from "@rockooor/sail";
import { SAVEWrapper } from "@tribecahq/save";
import { useState } from "react";
import { Link } from "gatsby";
import React from "react";
import invariant from "tiny-invariant";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { Alert } from "@/components/tribeca/common/Alert";
import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { ModalInner } from "@/components/tribeca/common/Modal/ModalInner";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { InputTokenAmount } from "@/components/tribeca/common/inputs/InputTokenAmount";
import { LabeledInput } from "@/components/tribeca/common/inputs/LabeledInput";
import { tsToDate } from "@saberhq/solana-contrib";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import { useProvider } from "@/hooks/tribeca/useProvider";
import { formatDurationSeconds } from "@/utils/tribeca/format";
export const LockSAVEForm = ({ saveData }) => {
    const { path } = useGovernor();
    const { data: saveToken } = useToken(saveData.account.mint);
    const [amountStr, setAmountStr] = useState("");
    const tokenAmount = useTokenAmount(saveToken, amountStr);
    const [userBalance] = useUserATAs(saveToken);
    const { signAndConfirmTX } = useTXHandlers();
    const { escrow } = useUserEscrow();
    const { providerMut } = useProvider();
    const { wrapTx } = useWrapTx();
    const currentLockEndsAt = escrow
        ? tsToDate(escrow.escrow.escrowEndsAt)
        : null;
    const minLockEndsAt = new Date(Date.now() + saveData.account.minLockDuration.toNumber() * 1_000);
    const existingEscrowExtended = currentLockEndsAt !== null && currentLockEndsAt < minLockEndsAt;
    const lockDuration = escrow === undefined
        ? undefined
        : currentLockEndsAt === null || currentLockEndsAt < minLockEndsAt
            ? saveData.account.minLockDuration.toNumber()
            : Math.ceil((currentLockEndsAt.getTime() - Date.now()) / 1_000);
    const disabledReason = !providerMut
        ? "Connect Wallet"
        : !tokenAmount || tokenAmount.isZero()
            ? "Enter a token amount"
            : userBalance && tokenAmount.greaterThan(userBalance.balance)
                ? "Insufficient balance"
                : lockDuration === undefined
                    ? "Loading..."
                    : null;
    return (React.createElement(ProseSmall, { className: "flex flex-col gap-4" },
        React.createElement(InputTokenAmount, { label: "Tokens to Lock", tokens: [], token: saveToken ?? null, inputValue: amountStr, inputOnChange: setAmountStr, currentAmount: {
                amount: userBalance?.balance,
                allowSelect: true,
            } }),
        React.createElement(LabeledInput, { Component: InputText, label: "Lock Duration", value: lockDuration === undefined
                ? "Loading..."
                : formatDurationSeconds(lockDuration), disabled: true, footer: React.createElement(React.Fragment, null,
                "To increase this duration, visit the",
                " ",
                React.createElement(Link, { to: `${path}/locker` }, "Locker"),
                " after locking.") }),
        existingEscrowExtended && (React.createElement(Alert, { type: "warning" },
            React.createElement(ProseSmall, null,
                React.createElement("h2", null, "Your vote locker will be extended"),
                React.createElement("p", null,
                    "Your existing lockup expires at",
                    " ",
                    currentLockEndsAt?.toLocaleString(),
                    ", but locking these SAVE tokens will increase this to ",
                    minLockEndsAt?.toLocaleString(),
                    "."),
                React.createElement("p", null, "Ensure that you are comfortable with a longer lockup period.")))),
        React.createElement(ModalButton, { buttonProps: {
                variant: existingEscrowExtended ? "danger" : "primary",
                disabled: !!disabledReason,
            }, buttonLabel: disabledReason ??
                (existingEscrowExtended
                    ? "Extend and Lock SAVE Tokens"
                    : "Lock SAVE Tokens") },
            React.createElement(ModalInner, { title: `Lock SAVE Tokens`, buttonProps: {
                    onClick: async () => {
                        invariant(tokenAmount && providerMut && lockDuration);
                        const saveSDK = new SAVEWrapper(providerMut);
                        const tx = await saveSDK.lock({
                            amount: tokenAmount,
                            duration: lockDuration,
                        });
                        await signAndConfirmTX(await wrapTx(tx), `Lock SAVE`);
                    },
                    variant: "primary",
                    children: "Lock SAVE Tokens",
                } },
                React.createElement("div", { className: "px-8 flex flex-col items-center" }, existingEscrowExtended && (React.createElement(Alert, { type: "warning" },
                    React.createElement(ProseSmall, null,
                        React.createElement("h2", null, "Your vote locker will be extended"),
                        React.createElement("p", null,
                            "Your existing lockup expires at",
                            " ",
                            currentLockEndsAt?.toLocaleString(),
                            ", but locking these SAVE tokens will increase this to",
                            " ",
                            minLockEndsAt?.toLocaleString(),
                            "."),
                        React.createElement("p", null, "Ensure that you are comfortable with a longer lockup period.")))))))));
};
