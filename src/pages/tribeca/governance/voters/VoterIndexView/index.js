import { RewarderProvider } from "@rockooor/react-quarry";
import { useLocation } from "@reach/router";
import React from "react";
import { useCardinalResolvedAddress } from "../../../../../hooks/tribeca/cardinal/useCardinalResolvedAddress";
import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { useGMData } from "../../gauges/hooks/useGaugemeister";
import { VoterHeader } from "./VoterHeader";
import { VoterInner } from "./VoterInner";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const voter = paths[paths.indexOf('address') + 1] || '';
    return { voter };
}
export const VoterIndexView = () => {
    const location = useLocation();
    const { voter: voterKeyStr = "" } = getParams(location.pathname);
    const voterKey = useCardinalResolvedAddress(voterKeyStr);
    const { path } = useGovernor();
    const { data: gm } = useGMData();
    const { network } = useEnvironment();
    const rewarderKey = gm?.account.rewarder;
    useGovWindowTitle(`Voter`);
    return (React.createElement(GovernancePage, { backLink: {
            label: "Leaderboard",
            href: `${path}/leaderboard`,
        }, title: React.createElement(VoterHeader, { voterKey: voterKey }) }, voterKey && rewarderKey && (React.createElement(RewarderProvider, { initialState: { rewarderKey, network } },
        React.createElement(VoterInner, { voterKey: voterKey })))));
};
export default VoterIndexView;
