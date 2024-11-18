import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { AddressesInfo } from "./AddressesInfo";
import { ExecutiveCouncilInfo } from "./ExecutiveCouncilInfo";
import { GaugesInfo } from "./GaugesInfo";
import { GovernorInfo } from "./GovernorInfo";
import { LockerInfo } from "./LockerInfo";
import React from "react";
export const GovernanceDetailsView: React.FC = () => {
  useGovWindowTitle(`Details`);
  const { meta } = useGovernor();
  return (
    <GovernancePage title="Governance Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GovernorInfo />
        <LockerInfo />
        <ExecutiveCouncilInfo />
        {meta?.gauge && !meta.gauge.hidden && (
          <GaugesInfo gaugemeister={meta.gauge.gaugemeister} />
        )}
        {meta?.addresses && <AddressesInfo addresses={meta.addresses} />}
      </div>
    </GovernancePage>
  );
};
