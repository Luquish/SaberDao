import { Switch } from "@headlessui/react";
import { useState } from "react";
import tw from "twin.macro";

import { useGovWindowTitle } from "../../../../../../hooks/tribeca/useGovernor";
import { Card } from "../../../../../common/governance/Card";
import { GovernancePage } from "../../../../../common/governance/GovernancePage";
import { ProposalsList } from "../../../GovernanceOverviewView/nft-voter/ProposalsList";
import { ProposalBadgeWrapper } from "../../../GovernanceOverviewView/nft-voter/ProposalsList/ProposalCard";
import { LegendsNeverDie } from "./LegendsNeverDie";

export const ProposalsListView: React.FC = () => {
  const [showDrafts, setShowDrafts] = useState<boolean>(false);
  useGovWindowTitle(`Proposals`);

  return (
    <GovernancePage title="Governance Proposals" right={<LegendsNeverDie />}>
      <Card
        title={
          <div tw="flex w-full items-center justify-between">
            <div tw="flex items-center gap-4">
              <h2>All Proposals</h2>
            </div>
            <ProposalBadgeWrapper tw="flex gap-4 w-auto md:(w-[140px] justify-end)">
              <Switch.Group>
                <div tw="flex items-center text-sm">
                  <Switch<"button">
                    checked={showDrafts}
                    onChange={setShowDrafts}
                    css={[
                      showDrafts ? tw`bg-primary` : tw`bg-warmGray-600`,
                      tw`relative inline-flex items-center h-6 rounded-full w-11 transition-colors`,
                    ]}
                  >
                    <span
                      css={[
                        showDrafts ? tw`translate-x-6` : tw`translate-x-1`,
                        tw`inline-block w-4 h-4 transform bg-white rounded-full transition-transform`,
                      ]}
                    />
                  </Switch>
                  <Switch.Label tw="ml-2 font-medium text-warmGray-400">
                    Show Drafts
                  </Switch.Label>
                </div>
              </Switch.Group>
            </ProposalBadgeWrapper>
          </div>
        }
      >
        <ProposalsList showDrafts={showDrafts} />
      </Card>
    </GovernancePage>
  );
};
