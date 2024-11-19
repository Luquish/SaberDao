import { Switch } from "@headlessui/react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import Card from "@/components/tribeca/common/governance/Card";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import ProposalsList from "@/pages/tribeca/GovernanceOverviewView/locked-voter/ProposalsList";
import { LegendsNeverDie } from "./LegendsNeverDie";

const ProposalsListView: React.FC = () => {
  const { path } = useGovernor();
  const [showDrafts, setShowDrafts] = useState<boolean>(false);
  useGovWindowTitle(`Proposals`);

  return (
    <GovernancePage title="Governance Proposals" right={<LegendsNeverDie />}>
      <Card
        title={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <h2>All Proposals</h2>
              <Link
                to={`/tribeca${path}/proposals/create`}
                className="pt-0.5 flex items-center text-primary hover:text-white transition-all"
              >
                <button>
                  <FaPlusCircle />
                </button>
              </Link>
            </div>
            <div className="flex gap-4 w-auto md:w-[140px] md:justify-end">
              <Switch.Group>
                <div className="flex items-center text-sm">
                  <Switch
                    checked={showDrafts}
                    onChange={setShowDrafts}
                    className={clsx(
                      "relative inline-flex items-center h-6 rounded-full w-11 transition-colors",
                      showDrafts ? "bg-primary" : "bg-warmGray-600"
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-block w-4 h-4 transform bg-white rounded-full transition-transform",
                        showDrafts ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 font-medium text-warmGray-400">
                    Show Drafts
                  </Switch.Label>
                </div>
              </Switch.Group>
            </div>
          </div>
        }
      >
        <ProposalsList showDrafts={showDrafts} />
      </Card>
    </GovernancePage>
  );
};

export default ProposalsListView;
