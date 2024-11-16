import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { LockerIndexView as LockedVoter } from "./locked-voter";
import { LockerIndexView as NftVoter } from "./nft-voter";

export const LockerIndexView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default LockerIndexView;
