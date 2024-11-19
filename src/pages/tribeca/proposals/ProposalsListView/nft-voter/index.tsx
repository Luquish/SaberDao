import { Switch } from "@headlessui/react";
import { useState } from "react";
import React from 'react';

import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import Card from "@/components/tribeca/common/governance/Card";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import ProposalsList from "@/pages/tribeca/GovernanceOverviewView/nft-voter/ProposalsList";
import { ProposalBadgeWrapper } from "@/pages/tribeca/GovernanceOverviewView/nft-voter/ProposalsList/ProposalCard";
import LegendsNeverDie from "@/pages/tribeca/proposals/ProposalsListView/nft-voter/LegendsNeverDie";

const ProposalsListView: React.FC = () => {
  const [showDrafts, setShowDrafts] = useState<boolean>(false);
  useGovWindowTitle(`Proposals`);

  return (
    <GovernancePage title="Governance Proposals" right={<LegendsNeverDie />}>
      <Card
        title={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <h2>All Proposals</h2>
            </div>
            <ProposalBadgeWrapper>
              <Switch.Group>
                <div className="flex items-center text-sm">
                  <Switch<"button">
                    checked={showDrafts}
                    onChange={setShowDrafts}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      showDrafts ? "bg-primary" : "bg-warmGray-600"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        showDrafts ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 font-medium text-warmGray-400">
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

export default ProposalsListView;