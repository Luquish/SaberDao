import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { GovernanceDetailsView as LockedVoter } from "./locked-voter";
import { GovernanceDetailsView as NftVoter } from "./nft-voter";
export const GovernanceDetailsView = () => {
    const { manifest } = useGovernor();
    if (manifest?.mndeNftLocker) {
        return React.createElement(NftVoter, null); // The NftVoter is developed and currently only used by Marinade
    }
    else {
        return React.createElement(LockedVoter, null);
    }
};
export default GovernanceDetailsView;
