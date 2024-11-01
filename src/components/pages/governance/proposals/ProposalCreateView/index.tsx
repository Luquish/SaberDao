import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { ProposalCreateView as LockedVoter } from "./locked-voter";
import { ProposalCreateView as NftVoter } from "./nft-voter";

export const ProposalCreateView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default ProposalCreateView;
