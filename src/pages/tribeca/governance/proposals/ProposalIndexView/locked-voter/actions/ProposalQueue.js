import { useSail } from "@rockooor/sail";
import BN from "bn.js";
import invariant from "tiny-invariant";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AsyncButton } from "@/common/AsyncButton";
import { Card } from "@/common/governance/Card";
export const ProposalQueue = ({ proposal, onActivate, }) => {
    const { governorW } = useGovernor();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const votingEndedAt = new Date(proposal.proposalData.votingEndsAt.toNumber() * 1_000);
    return (React.createElement(Card, { title: "Proposal Passed" },
        React.createElement("div", { tw: "px-7 py-4 text-sm" },
            React.createElement("p", { tw: "mb-4" },
                "The proposal passed successfully on ",
                votingEndedAt.toLocaleString(),
                "."),
            React.createElement("div", { tw: "flex justify-center items-center" },
                React.createElement(AsyncButton, { disabled: !governorW, tw: "w-3/4", variant: "primary", onClick: async () => {
                        invariant(governorW);
                        const tx = await governorW.queueProposal({
                            index: new BN(proposal.index),
                        });
                        const { pending, success } = await handleTX(await wrapTx(tx), "Queue Proposal");
                        if (!pending || !success) {
                            return;
                        }
                        await pending.wait();
                        onActivate();
                    } }, "Queue Proposal")))));
};
