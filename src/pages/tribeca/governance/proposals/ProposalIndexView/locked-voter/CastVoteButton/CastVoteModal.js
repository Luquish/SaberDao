import { useSail } from "@rockooor/sail";
import { createMemoInstruction } from "@saberhq/solana-contrib";
import { useState } from "react";
import invariant from "tiny-invariant";
import { useSDK } from "@/contexts/sdk";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useVote } from "@/hooks/tribeca/useVote";
import { useWrapTx } from "@/hooks/useWrapTx";
import { ModalInner } from "@/common/Modal/ModalInner";
import { VOTE_SIDE_LABEL } from "../VotesCard";
import { VoteResult } from "./VoteResult";
import { VoteSelectContents } from "./VoteSelectContents";
export const CastVoteModal = ({ proposalInfo }) => {
    const { data: escrow } = useUserEscrow();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { sdkMut } = useSDK();
    const { data: myVote } = useVote(proposalInfo.proposalKey, sdkMut?.provider.wallet.publicKey);
    const [side, setSide] = useState(myVote?.accountInfo.data.side ?? null);
    const [reason, setReason] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const vote = async () => {
        invariant(escrow && side);
        const tx = await escrow.escrowW.castVote({
            proposal: proposalInfo.proposalKey,
            side,
        });
        const memoIX = createMemoInstruction(reason, [
            escrow.escrowW.provider.wallet.publicKey,
        ]);
        tx.addInstructions(memoIX);
        const { pending } = await handleTX(await wrapTx(tx), `Vote ${VOTE_SIDE_LABEL[side]}`);
        if (!pending) {
            return;
        }
        await pending.wait();
        setHasVoted(true);
    };
    if (side && hasVoted) {
        return (React.createElement(VoteResult, { side: side, proposalInfo: proposalInfo, reason: reason }));
    }
    return (React.createElement(ModalInner, { title: "Cast Vote", tw: "px-6 max-w-md", buttonProps: {
            disabled: !(side && escrow),
            onClick: vote,
            variant: "primary",
            children: side
                ? `Cast ${VOTE_SIDE_LABEL[side]} Vote`
                : "Select a Vote Side",
        } },
        React.createElement(VoteSelectContents, { proposal: proposalInfo, side: side, setSide: setSide, reason: reason, setReason: setReason })));
};
