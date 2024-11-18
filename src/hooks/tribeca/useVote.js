import { useQuery } from "@tanstack/react-query";
import { findVoteAddress } from "@tribecahq/tribeca-sdk";
import invariant from "tiny-invariant";
import { useParsedVote } from "../../utils/parsers";
import { useEnvironment } from "../../utils/useEnvironment";
export const useVote = (proposalKey, voter) => {
    const { network } = useEnvironment();
    const voteKey = useQuery({
        queryKey: ["voteKey", network, proposalKey?.toString(), voter?.toString()],
        queryFn: async () => {
            invariant(proposalKey && voter);
            const [escrowKey] = await findVoteAddress(proposalKey, voter);
            return escrowKey;
        },
        enabled: !!(proposalKey && voter),
    });
    return useParsedVote(voteKey.data);
};
