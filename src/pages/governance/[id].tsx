import React from 'react';
import { useGovernor } from "@/src/hooks/governance/useGovernor";
{/*import { GovernanceOverviewView as LockedVoter } from "../../components/governance/pages/locked-voter";*/ }
import { GovernanceOverviewView as NftVoter } from "../../components/governance/pages/nft-voter";


export const GovernanceOverviewView: React.FC = () => {
  const { manifest } = useGovernor();

  return <NftVoter />;
  {/* TODO: Add LockedVoter
  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
  */}
};

export default GovernanceOverviewView;
