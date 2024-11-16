import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { ProposalIndexView as LockedVoter } from "./locked-voter";
import { ProposalIndexView as NftVoter } from "./nft-voter";

export const ProposalIndexView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default ProposalIndexView;
