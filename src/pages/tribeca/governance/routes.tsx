import React, { lazy } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import { Temp } from "@/components/tribeca/common/temp/index";

import { GMProvider } from "./gauges/context";

const NftGaugesView: React.FC<RouteComponentProps & { label: string }> = React.lazy(() => import("./nft-gauges/Index"));
const LockerIndexView: React.FC<RouteComponentProps<{ lockerSubpage: string }>> = React.lazy(() => import("./locker/LockerIndexView"));
const ProgramsView: React.FC<RouteComponentProps> = React.lazy(() => import("./ProgramsView"));
const ProposalCreateView: React.FC<RouteComponentProps> = React.lazy(() => import("./proposals/ProposalCreateView"));
const ProposalIndexView: React.FC<RouteComponentProps<{ proposalIndex: string }>> = React.lazy(() => import("./proposals/ProposalIndexView"));
const ProposalsListView: React.FC<RouteComponentProps> = React.lazy(() => import("./proposals/ProposalsListView"));
const SAVECreateView: React.FC<RouteComponentProps> = lazy(() => import("./save/SAVECreateView"));
const SAVEIndexView: React.FC<RouteComponentProps<{ saveMintStr: string }>> = lazy(() => import("./save/SAVEIndexView"));
const SAVESListView: React.FC<RouteComponentProps> = lazy(() => import("./save/SAVESListView"));
const AllVotersView: React.FC<RouteComponentProps> = lazy(() => import("./voters/AllVotersView"));
const VoterIndexView: React.FC<RouteComponentProps<{ voter: string }>> = lazy(() => import("./voters/VoterIndexView"));
const VoterSnapshotsView: React.FC<RouteComponentProps<{ voter: string }>> = lazy(() => import("./voters/VoterSnapshotsView"));

const GaugesAllView: React.FC<RouteComponentProps> = React.lazy(() => import("./gauges/GaugesAllView"));
const GaugesIndexView: React.FC<RouteComponentProps> = React.lazy(() => import("./gauges/GaugesIndexView"));
const GaugesSetupView: React.FC<RouteComponentProps> = React.lazy(() => import("./gauges/GaugesSetupView"));
const GaugeWeightsView: React.FC<RouteComponentProps> = React.lazy(() => import("./gauges/GaugeWeightsView"));
const GovernanceDetailsView: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceDetailsView"));
const GovernanceManageView: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView"));
const GovernanceOverviewView: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceOverviewView"));
const GovernanceSetupView: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceSetupView"));

const ConfigTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/ConfigTab"));
const ExecutiveCouncilTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/ExecutiveCouncilTab"));
const GaugesTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/GaugesTab"));
const OverviewTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/OverviewTab"));
const QuarryMinterTab: React.FC<RouteComponentProps<{ minterAuthorityKey: string }>> = React.lazy(() => import("./GovernanceManageView/tabs/quarry/QuarryMinterTab"));
const QuarryRewardersTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/quarry/QuarryRewardersTab"));
const SaberMintProxyTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/saber/SaberMintProxyTab"));
const SaberRedeemerTab: React.FC<RouteComponentProps> = React.lazy(() => import("./GovernanceManageView/tabs/saber/SaberRedeemerTab"));
const SaberPoolView: React.FC<RouteComponentProps<{ poolID: string }>> = lazy(() => import("./saber-pools/SaberPoolView"));
const SaberPoolsView: React.FC<RouteComponentProps> = lazy(() => import("./saber-pools/SaberPoolsView"));

export const governanceRoutes = (
  <>
    <Router>
      <SaberPoolsView path="/tribeca/gov/saber-pools" />
      <SaberPoolView path="/tribeca/gov/saber-pools/:poolID/fees" />
      <SAVECreateView path="/tribeca/gov/saves/create" />
      <SAVEIndexView path="/tribeca/gov/saves/:saveMintStr" />
      <SAVESListView path="/tribeca/gov/saves" />
      <VoterSnapshotsView path="/tribeca/gov/address/:voter/snapshots" />
      <VoterIndexView path="/tribeca/gov/address/:voter" />
      <AllVotersView path="/tribeca/gov/leaderboard" />
      
      <Router basepath="/tribeca/gov/gauges">
        <GMProvider>
          <GaugesAllView path="all" />
          <GaugesSetupView path="setup" />
          <GaugeWeightsView path="weights" />
          <GaugesIndexView path="/" />
        </GMProvider>
      </Router>

      <GovernanceDetailsView path="/tribeca/gov/details" />
      <NftGaugesView label="Validator" path="/tribeca/gov/nftgauges/validator" />
      <NftGaugesView label="Liquidity" path="/tribeca/gov/nftgauges/liquidity" />
      <LockerIndexView path="/tribeca/gov/locker/:lockerSubpage" />
      <LockerIndexView path="/tribeca/gov/locker" />
      <ProposalCreateView path="/tribeca/gov/proposals/create" />
      <ProposalIndexView path="/tribeca/gov/proposals/:proposalIndex" />
      <ProgramsView path="/tribeca/gov/programs" />
      <ProposalsListView path="/tribeca/gov/proposals" />
      <GovernanceSetupView path="/tribeca/gov/setup" />
      <Temp path="/tribeca/gov/temp" />
      
      <Router basepath="/tribeca/gov/manage">
        <SaberMintProxyTab path="saber/mint-proxy" />
        <SaberRedeemerTab path="saber/redeemer" />
        <ExecutiveCouncilTab path="executive-council" />
        <ConfigTab path="config" />
        <GaugesTab path="gauges" />
        <QuarryMinterTab path="quarry/minters/:minterAuthorityKey" />
        <QuarryRewardersTab path="rewarders" />
        <OverviewTab path="/" />
      </Router>

      <GovernanceOverviewView path="/tribeca/gov/" />
    </Router>
  </>
);
