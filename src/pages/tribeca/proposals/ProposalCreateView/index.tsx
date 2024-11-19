import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import LockedVoter from "./locked-voter";
import NftVoter  from "./nft-voter";

const ProposalCreateView: React.FC = () => {
  const { manifest } = useGovernor();

  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
};

export default ProposalCreateView;
