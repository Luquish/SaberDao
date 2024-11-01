import React, { lazy } from "react";
import { Outlet, Route } from "react-router-dom";
import { Temp } from "../../common/Temp";

import { GMProvider } from "./gauges/context";

const NftGaugesView = React.lazy(() => import("./nft-gauges/Index"));
const LockerIndexView = React.lazy(() => import("./locker/LockerIndexView"));
const ProgramsView = React.lazy(() => import("./ProgramsView"));
const ProposalCreateView = React.lazy(
  () => import("./proposals/ProposalCreateView")
);
const ProposalIndexView = React.lazy(
  () => import("./proposals/ProposalIndexView")
);
const ProposalsListView = React.lazy(
  () => import("./proposals/ProposalsListView")
);
const SAVECreateView = React.lazy(() => import("./save/SAVECreateView"));
const SAVEIndexView = React.lazy(() => import("./save/SAVEIndexView"));
const SAVESListView = React.lazy(() => import("./save/SAVESListView"));
const AllVotersView = React.lazy(() => import("./voters/AllVotersView"));
const VoterIndexView = React.lazy(() => import("./voters/VoterIndexView"));
const VoterSnapshotsView = React.lazy(
  () => import("./voters/VoterSnapshotsView")
);

const GaugesAllView = React.lazy(() => import("./gauges/GaugesAllView"));
const GaugesIndexView = React.lazy(() => import("./gauges/GaugesIndexView"));
const GaugesSetupView = React.lazy(() => import("./gauges/GaugesSetupView"));
const GaugeWeightsView = React.lazy(() => import("./gauges/GaugeWeightsView"));
const GovernanceDetailsView = React.lazy(
  () => import("./GovernanceDetailsView")
);
const GovernanceManageView = React.lazy(() => import("./GovernanceManageView"));
const GovernanceOverviewView = React.lazy(
  () => import("./GovernanceOverviewView")
);
const GovernanceSetupView = React.lazy(() => import("./GovernanceSetupView"));

const ConfigTab = React.lazy(
  () => import("./GovernanceManageView/tabs/ConfigTab")
);
const ExecutiveCouncilTab = React.lazy(
  () => import("./GovernanceManageView/tabs/ExecutiveCouncilTab")
);
const GaugesTab = React.lazy(
  () => import("./GovernanceManageView/tabs/GaugesTab")
);
const OverviewTab = React.lazy(
  () => import("./GovernanceManageView/tabs/OverviewTab")
);
const QuarryMinterTab = React.lazy(
  () => import("./GovernanceManageView/tabs/quarry/QuarryMinterTab")
);
const QuarryRewardersTab = React.lazy(
  () => import("./GovernanceManageView/tabs/quarry/QuarryRewardersTab")
);
const SaberMintProxyTab = React.lazy(
  () => import("./GovernanceManageView/tabs/saber/SaberMintProxyTab")
);
const SaberRedeemerTab = React.lazy(
  () => import("./GovernanceManageView/tabs/saber/SaberRedeemerTab")
);
const SaberPoolView = lazy(() => import("./saber-pools/SaberPoolView"));
const SaberPoolsView = lazy(() => import("./saber-pools/SaberPoolsView"));

export const governanceRoutes = (
  <>
    <Route element={<SaberPoolsView />} path="saber-pools" />
    <Route element={<SaberPoolView />} path="saber-pools/:poolID/fees" />
    <Route element={<SAVECreateView />} path="saves/create" />
    <Route element={<SAVEIndexView />} path="saves/:saveMintStr" />
    <Route element={<SAVESListView />} path="saves" />
    <Route element={<VoterSnapshotsView />} path="address/:voter/snapshots" />
    <Route element={<VoterIndexView />} path="address/:voter" />
    <Route element={<AllVotersView />} path="leaderboard" />
    <Route
      path="gauges"
      element={
        <GMProvider>
          <Outlet />
        </GMProvider>
      }
    >
      <Route element={<GaugesAllView />} path="all" />
      <Route element={<GaugesSetupView />} path="setup" />
      <Route element={<GaugeWeightsView />} path="weights" />
      <Route element={<GaugesIndexView />} path="" />
    </Route>
    <Route element={<GovernanceDetailsView />} path="details" />
    <Route
      element={<NftGaugesView label="Validator" />}
      path="nftgauges/validator"
    />
    <Route
      element={<NftGaugesView label="Liquidity" />}
      path="nftgauges/liquidity"
    />
    <Route element={<LockerIndexView />} path="locker/:lockerSubpage" />
    <Route element={<LockerIndexView />} path="locker" />
    <Route element={<ProposalCreateView />} path="proposals/create" />
    <Route element={<ProposalIndexView />} path="proposals/:proposalIndex" />
    <Route element={<ProgramsView />} path="programs" />
    <Route element={<ProposalsListView />} path="proposals" />
    <Route element={<GovernanceSetupView />} path="setup" />
    <Route element={<Temp />} path="temp" />
    <Route element={<GovernanceManageView />} path="manage">
      <Route path="saber/mint-proxy" element={<SaberMintProxyTab />} />
      <Route path="saber/redeemer" element={<SaberRedeemerTab />} />
      <Route path="executive-council" element={<ExecutiveCouncilTab />} />
      <Route path="config" element={<ConfigTab />} />
      <Route path="gauges" element={<GaugesTab />} />
      <Route
        path="quarry/minters/:minterAuthorityKey"
        element={<QuarryMinterTab />}
      />
      <Route path="rewarders" element={<QuarryRewardersTab />} />
      <Route path="" element={<OverviewTab />} />
    </Route>
    <Route element={<GovernanceOverviewView />} path="" />
  </>
);
