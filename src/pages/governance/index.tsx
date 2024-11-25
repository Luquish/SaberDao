import React from 'react';
import { GovernorProvider } from "@/src/hooks/governance/useGovernor";
import { GovernanceOverviewView as NftVoter } from "../../components/governance/pages/nft-voter";

const GovernanceOverviewView: React.FC = () => {
  return <NftVoter />;
};

// Wrap the export with the Provider
export default function GovernanceOverviewPage() {
  return (
    <GovernanceOverviewView />
  );
}

{/*
import React from 'react';
import { useGovernor } from "@/src/hooks/governance/useGovernor";
{import { GovernanceOverviewView as LockedVoter } from "../../components/governance/pages/locked-voter";
import { GovernanceOverviewView as NftVoter } from "../../components/governance/pages/nft-voter";


export const GovernanceOverviewView: React.FC = () => {
  const { manifest } = useGovernor();

  
  if (manifest?.mndeNftLocker) {
    return <NftVoter />; // The NftVoter is developed and currently only used by Marinade
  } else {
    return <LockedVoter />;
  }
  
};

export default GovernanceOverviewView;
*/}