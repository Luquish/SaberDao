import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import LockedVoter from "@/pages/tribeca/locker/LockerIndexView/locked-voter";
import NftVoter from "@/pages/tribeca/GovernanceOverviewView/nft-voter";

const GovernanceOverviewView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default GovernanceOverviewView;
