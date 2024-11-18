import { useProvider } from "@/hooks/useProvider";
import { Button } from "../../../../../common/Button";
import { useCommitVotes } from "../../hooks/useCommitVotes";
export const CommitVotesButton = (props) => {
    const { providerMut } = useProvider();
    const owner = props.owner ?? providerMut?.wallet?.publicKey;
    const commitVotes = useCommitVotes(owner);
    return (React.createElement(Button, { variant: "muted", onClick: commitVotes }, "Commit"));
};
