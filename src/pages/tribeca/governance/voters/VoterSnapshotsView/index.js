import { useLocation } from "@reach/router";
import React from "react";
import { useCardinalResolvedAddress } from "../../../../../hooks/tribeca/cardinal/useCardinalResolvedAddress";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { LockerSnapshots } from "../../locker/LockerIndexView/locked-voter/LockerSnapshots";
import { AllLockerSnapshotsTable } from "./AllLockerSnapshotsTable";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const voter = paths[paths.indexOf('address') + 1] || '';
    return { voter };
}
export const VoterSnapshotsView = () => {
    const location = useLocation();
    const { voter: voterKeyStr = "" } = getParams(location.pathname);
    const voterKey = useCardinalResolvedAddress(voterKeyStr);
    return (React.createElement(GovernancePage, { title: "Vote Locker Snapshots" },
        React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement(LockerSnapshots, { owner: voterKey }),
            React.createElement(AllLockerSnapshotsTable, { owner: voterKey }))));
};
export default VoterSnapshotsView;
