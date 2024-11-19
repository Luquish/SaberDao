import { RewarderProvider } from "@rockooor/react-quarry";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useCardinalResolvedAddress } from "@/hooks/tribeca/cardinal/useCardinalResolvedAddress";
import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import { useGMData } from "@/hooks/tribeca/useGaugemeister";
import VoterHeader from "@/pages/tribeca/voters/VoterIndexView/VoterHeader";
import VoterInner from "@/pages/tribeca/voters/VoterIndexView/VoterInner";
import { getUrlParams } from "@/utils/tribeca/urlParams";

export const VoterIndexView: React.FC = () => {
  const location = useLocation();
  const voter = getUrlParams.voter(location.pathname);
  const voterKey = useCardinalResolvedAddress(voter);
  const { path } = useGovernor();
  const { data: gm } = useGMData();
  const { network } = useEnvironment();
  const rewarderKey = gm?.account.rewarder;

  useGovWindowTitle(`Voter`);
  return (
    <GovernancePage
      backLink={{
        label: "Leaderboard",
        href: `${path}/leaderboard`,
      }}
      title={<VoterHeader voterKey={voterKey} />}
    >
      {voterKey && rewarderKey && (
        <RewarderProvider initialState={{ rewarderKey, network }}>
          <VoterInner voterKey={voterKey} />
        </RewarderProvider>
      )}
    </GovernancePage>
  );
};

export default VoterIndexView;
