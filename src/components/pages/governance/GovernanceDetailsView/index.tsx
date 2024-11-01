import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { GovernanceDetailsView as LockedVoter } from "./locked-voter";
import { GovernanceDetailsView as NftVoter } from "./nft-voter";

export const GovernanceDetailsView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default GovernanceDetailsView;
