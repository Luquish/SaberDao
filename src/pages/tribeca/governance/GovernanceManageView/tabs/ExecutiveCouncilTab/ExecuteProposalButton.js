import { useTXHandlers } from "@rockooor/sail";
import { mapSome, tsToDate } from "@saberhq/solana-contrib";
import pluralize from "pluralize";
import Countdown from "react-countdown";
import invariant from "tiny-invariant";
import React from 'react';
import { useSDK } from "@/contexts/sdk";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AsyncConfirmButton } from "@/components/tribeca/common/AsyncConfirmButton";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import { EmbedTX } from "../../../proposals/ProposalIndexView/locked-voter/EmbedTX";
export const ExecuteProposalButton = ({ tx, onActivate, }) => {
    const { governorW, smartWallet } = useGovernor();
    const { ecWallet } = useExecutiveCouncil();
    const { sdkMut } = useSDK();
    const { wrapTx } = useWrapTx();
    const { signAndConfirmTX } = useTXHandlers();
    const eta = tsToDate(tx.account.eta);
    const gracePeriodEnd = mapSome(ecWallet.data, (d) => !tx.account.eta.isNeg()
        ? tsToDate(tx.account.eta.add(d.account.gracePeriod))
        : null);
    const etaSurpassed = eta <= new Date();
    const gracePeriodSurpassed = !!mapSome(gracePeriodEnd, (g) => g <= new Date());
    const disabledReason = !governorW
        ? "No governor"
        : !ecWallet.data
            ? "No EC wallet"
            : !etaSurpassed
                ? "ETA not surpassed"
                : gracePeriodSurpassed
                    ? "Grace period surpassed"
                    : null;
    return (React.createElement(AsyncConfirmButton, { modal: {
            title: "Execute Proposal",
            style: { maxWidth: "32rem" },
            contents: (React.createElement("div", { className: "contents" },
                React.createElement(ProseSmall, { className: "text-center" },
                    React.createElement("p", null,
                        "You are about to execute the following",
                        " ",
                        pluralize("instruction", tx.account.instructions.length),
                        " on behalf of the DAO:")),
                React.createElement("div", { className: "w-full overflow-x-scroll" },
                    React.createElement(EmbedTX, { txKey: tx.publicKey })),
                React.createElement(ProseSmall, { className: "text-center" },
                    React.createElement("p", null, "There will be two instructions for you to sign: the first is to approve the proposal for execution by the smart wallet, and the second is to execute the transaction on behalf of the smart wallet.")))),
        }, disabled: !governorW ||
            !ecWallet.data ||
            !etaSurpassed ||
            gracePeriodSurpassed ||
            !!disabledReason, className: "w-3/4", variant: "primary", onClick: async () => {
            invariant(governorW && sdkMut && smartWallet && ecWallet.data);
            const sw = await sdkMut.loadSmartWallet(ecWallet.data.publicKey);
            const [invoker] = await sw.findOwnerInvokerAddress(0);
            const invokeTX = await sw.ownerInvokeInstructionV2({
                instruction: sdkMut.programs.SmartWallet.instruction.approve({
                    accounts: {
                        smartWallet: smartWallet,
                        transaction: tx.publicKey,
                        owner: invoker,
                    },
                }),
                index: 0,
            });
            await signAndConfirmTX(await wrapTx(invokeTX), "Approve Proposal");
            const executeTX = await (await sdkMut.loadSmartWallet(smartWallet)).executeTransaction({
                transactionKey: tx.publicKey,
                owner: invoker,
            });
            const executeIX = executeTX.instructions[0];
            invariant(executeIX, "executed");
            const executeInvoke = await sw.ownerInvokeInstructionV2({
                instruction: executeIX,
                index: 0,
            });
            await signAndConfirmTX(await wrapTx(executeInvoke), "Execute Proposal");
            onActivate?.();
        } }, disabledReason ??
        (!etaSurpassed ? (React.createElement(React.Fragment, null,
            React.createElement("span", { className: "mr-1" }, "ETA in"),
            React.createElement(Countdown, { date: eta }))) : ("Execute Proposal"))));
};
