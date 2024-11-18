import React, { lazy } from "react";
import { Router } from "@reach/router";
import { Temp } from "@/components/tribeca/common/temp/index";
import { GMProvider } from "./gauges/context";
const NftGaugesView = React.lazy(() => import("./nft-gauges/Index"));
const LockerIndexView = React.lazy(() => import("./locker/LockerIndexView"));
const ProgramsView = React.lazy(() => import("./ProgramsView"));
const ProposalCreateView = React.lazy(() => import("./proposals/ProposalCreateView"));
const ProposalIndexView = React.lazy(() => import("./proposals/ProposalIndexView"));
const ProposalsListView = React.lazy(() => import("./proposals/ProposalsListView"));
const SAVECreateView = lazy(() => import("./save/SAVECreateView"));
const SAVEIndexView = lazy(() => import("./save/SAVEIndexView"));
const SAVESListView = lazy(() => import("./save/SAVESListView"));
const AllVotersView = lazy(() => import("./voters/AllVotersView"));
const VoterIndexView = lazy(() => import("./voters/VoterIndexView"));
const VoterSnapshotsView = lazy(() => import("./voters/VoterSnapshotsView"));
const GaugesAllView = React.lazy(() => import("./gauges/GaugesAllView"));
const GaugesIndexView = React.lazy(() => import("./gauges/GaugesIndexView"));
const GaugesSetupView = React.lazy(() => import("./gauges/GaugesSetupView"));
const GaugeWeightsView = React.lazy(() => import("./gauges/GaugeWeightsView"));
const GovernanceDetailsView = React.lazy(() => import("./GovernanceDetailsView"));
const GovernanceManageView = React.lazy(() => import("./GovernanceManageView"));
const GovernanceOverviewView = React.lazy(() => import("./GovernanceOverviewView"));
const GovernanceSetupView = React.lazy(() => import("./GovernanceSetupView"));
const ConfigTab = React.lazy(() => import("./GovernanceManageView/tabs/ConfigTab"));
const ExecutiveCouncilTab = React.lazy(() => import("./GovernanceManageView/tabs/ExecutiveCouncilTab"));
const GaugesTab = React.lazy(() => import("./GovernanceManageView/tabs/GaugesTab"));
const OverviewTab = React.lazy(() => import("./GovernanceManageView/tabs/OverviewTab"));
const QuarryMinterTab = React.lazy(() => import("./GovernanceManageView/tabs/quarry/QuarryMinterTab"));
const QuarryRewardersTab = React.lazy(() => import("./GovernanceManageView/tabs/quarry/QuarryRewardersTab"));
const SaberMintProxyTab = React.lazy(() => import("./GovernanceManageView/tabs/saber/SaberMintProxyTab"));
const SaberRedeemerTab = React.lazy(() => import("./GovernanceManageView/tabs/saber/SaberRedeemerTab"));
const SaberPoolView = lazy(() => import("./saber-pools/SaberPoolView"));
const SaberPoolsView = lazy(() => import("./saber-pools/SaberPoolsView"));
const governanceRoutes = (React.createElement(React.Fragment, null,
    React.createElement(Router, null,
        React.createElement(SaberPoolsView, { path: "/tribeca/gov/saber-pools" }),
        React.createElement(SaberPoolView, { path: "/tribeca/gov/saber-pools/:poolID/fees" }),
        React.createElement(SAVECreateView, { path: "/tribeca/gov/saves/create" }),
        React.createElement(SAVEIndexView, { path: "/tribeca/gov/saves/:saveMintStr" }),
        React.createElement(SAVESListView, { path: "/tribeca/gov/saves" }),
        React.createElement(VoterSnapshotsView, { path: "/tribeca/gov/address/:voter/snapshots" }),
        React.createElement(VoterIndexView, { path: "/tribeca/gov/address/:voter" }),
        React.createElement(AllVotersView, { path: "/tribeca/gov/leaderboard" }),
        React.createElement(Router, { basepath: "/tribeca/gov/gauges" },
            React.createElement(GMProvider, null,
                React.createElement(GaugesAllView, { path: "all" }),
                React.createElement(GaugesSetupView, { path: "setup" }),
                React.createElement(GaugeWeightsView, { path: "weights" }),
                React.createElement(GaugesIndexView, { path: "/" }))),
        React.createElement(GovernanceDetailsView, { path: "/tribeca/gov/details" }),
        React.createElement(NftGaugesView, { label: "Validator", path: "/tribeca/gov/nftgauges/validator" }),
        React.createElement(NftGaugesView, { label: "Liquidity", path: "/tribeca/gov/nftgauges/liquidity" }),
        React.createElement(LockerIndexView, { path: "/tribeca/gov/locker/:lockerSubpage" }),
        React.createElement(LockerIndexView, { path: "/tribeca/gov/locker" }),
        React.createElement(ProposalCreateView, { path: "/tribeca/gov/proposals/create" }),
        React.createElement(ProposalIndexView, { path: "/tribeca/gov/proposals/:proposalIndex" }),
        React.createElement(ProgramsView, { path: "/tribeca/gov/programs" }),
        React.createElement(ProposalsListView, { path: "/tribeca/gov/proposals" }),
        React.createElement(GovernanceSetupView, { path: "/tribeca/gov/setup" }),
        React.createElement(Temp, { path: "/tribeca/gov/temp" }),
        React.createElement(Router, { basepath: "/tribeca/gov/manage" },
            React.createElement(SaberMintProxyTab, { path: "saber/mint-proxy" }),
            React.createElement(SaberRedeemerTab, { path: "saber/redeemer" }),
            React.createElement(ExecutiveCouncilTab, { path: "executive-council" }),
            React.createElement(ConfigTab, { path: "config" }),
            React.createElement(GaugesTab, { path: "gauges" }),
            React.createElement(QuarryMinterTab, { path: "quarry/minters/:minterAuthorityKey" }),
            React.createElement(QuarryRewardersTab, { path: "rewarders" }),
            React.createElement(OverviewTab, { path: "/" })),
        React.createElement(GovernanceOverviewView, { path: "/tribeca/gov/" }))));

export default governanceRoutes;
