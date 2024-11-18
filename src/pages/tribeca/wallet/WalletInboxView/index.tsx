import { Notice } from "@/components/tribeca/common/Notice";
import { BasicPage } from "@/components/tribeca/common/page/BasicPage";
import React from "react";
import { RouteComponentProps } from '@reach/router';

const today = new Date().toLocaleDateString(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
});

export const WalletInboxView: React.FC<RouteComponentProps> = () => {
  return (
    <BasicPage title="Welcome to Goki." description={`Today is ${today}.`}>
      <Notice>Select an action on the left.</Notice>
    </BasicPage>
  );
};
