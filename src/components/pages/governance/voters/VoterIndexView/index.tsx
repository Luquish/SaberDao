import { RewarderProvider } from "@rockooor/react-quarry";
import { useParams } from "react-router-dom";

import { useCardinalResolvedAddress } from "../../../../../hooks/cardinal/useCardinalResolvedAddress";
import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { useGMData } from "../../gauges/hooks/useGaugemeister";
import { VoterHeader } from "./VoterHeader";
import { VoterInner } from "./VoterInner";

export const VoterIndexView: React.FC = () => {
  const { voter: voterKeyStr = "" } = useParams<"voter">();
  const voterKey = useCardinalResolvedAddress(voterKeyStr);
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
