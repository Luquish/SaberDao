import { useSail, useTXHandlers } from "@rockooor/sail";
import { sleep } from "@saberhq/token-utils";
import { useEffect, useMemo } from "react";
import { Link } from "gatsby";
import React from "react";
import invariant from "tiny-invariant";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
export const ProposalActivate = ({ proposal, onActivate, }) => {
    const { minActivationThreshold, path, governorData } = useGovernor();
    const { data: escrow, veBalance, refetch } = useUserEscrow();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { signAndConfirmTX } = useTXHandlers();
    const earliestActivationTime = useMemo(() => governorData
        ? new Date(proposal.proposalData.createdAt
            .add(governorData.account.params.votingDelay)
            .toNumber() * 1_000)
        : null, [governorData, proposal.proposalData.createdAt]);
    useEffect(() => {
        if (!earliestActivationTime) {
            return;
        }
        const remainingTime = earliestActivationTime.getTime() - Date.now();
        const timeout = setTimeout(() => {
            void refetch();
        }, remainingTime + 1);
        return () => clearTimeout(timeout);
    }, [earliestActivationTime, refetch]);
    return (React.createElement(Card, { title: "Actions" },
        React.createElement("div", { className: "px-7 py-4 text-sm" }, !earliestActivationTime || !governorData ? (React.createElement(LoadingPage, null)) : earliestActivationTime > new Date() ? (React.createElement("div", { className: "flex flex-col gap-2" },
            React.createElement("p", null,
                "You must wait",
                " ",
                formatDurationSeconds(governorData.account.params.votingDelay.toNumber()),
                " ",
                "for this proposal to be activated."),
            React.createElement("p", null,
                "The proposal may be activated at",
                " ",
                earliestActivationTime?.toLocaleString(undefined, {
                    timeZoneName: "short",
                }),
                " ",
                "by anyone who possesses at least",
                " ",
                minActivationThreshold?.formatUnits(),
                "."))) : minActivationThreshold &&
            veBalance?.greaterThan(minActivationThreshold) ? (React.createElement("div", { className: "flex justify-center items-center" },
            React.createElement(Button, { disabled: !escrow, className: "w-3/4 dark:text-white hover:dark:text-primary hover:dark:border-primary", variant: "outline", onClick: async () => {
                    invariant(escrow);
                    const tx = escrow.escrowW.activateProposal(proposal.proposalKey);
                    await signAndConfirmTX(await wrapTx(tx), "Activate Proposal");
                    await sleep(1_000);
                    await refetch();
                    onActivate();
                } }, "Activate Proposal"))) : (React.createElement("div", { className: "flex flex-col gap-2" },
            React.createElement("p", null,
                "You must have at least",
                " ",
                React.createElement("strong", null, minActivationThreshold?.formatUnits()),
                " to activate this proposal for voting."),
            veBalance ? (React.createElement("p", null,
                "You currently have ",
                veBalance?.formatUnits(),
                ".")) : (React.createElement("p", null, "You currently don't have any tokens vote locked.")),
            React.createElement(Link, { className: "flex justify-center items-center", to: `/tribeca${path}/locker` },
                React.createElement(Button, { className: "w-3/4 mt-4" }, "Lock Tokens")))))));
};
