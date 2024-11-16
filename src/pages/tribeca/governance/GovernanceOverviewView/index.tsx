import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { GovernanceOverviewView as LockedVoter } from "./locked-voter";
import { GovernanceOverviewView as NftVoter } from "./nft-voter";

export const GovernanceOverviewView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default GovernanceOverviewView;
