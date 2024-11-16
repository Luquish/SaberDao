import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { ProposalsListView as LockedVoter } from "./locked-voter";
import { ProposalsListView as NftVoter } from "./nft-voter";

export const ProposalsListView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default ProposalsListView;
