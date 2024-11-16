import { RouteComponentProps } from '@reach/router';
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { BasicSection } from "../../../../../components/tribeca/common/page/Section";
import { Tokens } from "./Tokens";
import React from "react";

export const WalletTreasuryView: React.FC<RouteComponentProps> = () => {
  return (
    <BasicPage
      title="Treasury Management"
      description="Manage your tokens and staking positions"
    >
      <div className="grid gap-12">
        <BasicSection title="Assets">
          <Tokens />
        </BasicSection>
        <BasicSection
          title="Farms"
          description="(coming soon) Manage your yield farming positions."
        ></BasicSection>
      </div>
    </BasicPage>
  );
};
