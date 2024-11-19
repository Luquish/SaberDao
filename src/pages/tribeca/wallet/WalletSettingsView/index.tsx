import BasicPage from "@/components/tribeca/common/page/BasicPage";
import SignersSection from "./SignersSection";
import SubaccountsSection from "./SubaccountsSection";
import React from "react";
import { RouteComponentProps } from '@reach/router';

const WalletSettingsView: React.FC<RouteComponentProps> = () => {
  return (
    <BasicPage title="Settings" description="Manage your smart wallet settings">
      <div className="flex flex-col gap-12">
        <SignersSection />
        <SubaccountsSection />
      </div>
    </BasicPage>
  );
};

export default WalletSettingsView;
