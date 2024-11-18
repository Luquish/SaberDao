import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { AddressesInfo } from "./AddressesInfo";
import { ExecutiveCouncilInfo } from "./ExecutiveCouncilInfo";
import { GaugesInfo } from "./GaugesInfo";
import { GovernorInfo } from "./GovernorInfo";
import { LockerInfo } from "./LockerInfo";
export const GovernanceDetailsView = () => {
    useGovWindowTitle(`Details`);
    const { meta } = useGovernor();
    return (React.createElement(GovernancePage, { title: "Governance Details" },
        React.createElement("div", { tw: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(GovernorInfo, null),
            React.createElement(LockerInfo, null),
            React.createElement(ExecutiveCouncilInfo, null),
            meta?.gauge && !meta.gauge.hidden && (React.createElement(GaugesInfo, { gaugemeister: meta.gauge.gaugemeister })),
            meta?.addresses && React.createElement(AddressesInfo, { addresses: meta.addresses }))));
};
