import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { EscrowInfo } from "./EscrowInfo";
import { LockerSnapshotsBasic } from "./LockerSnapshotsBasic";
import { LockupDetails } from "./LockupDetails";

export const LockerIndexView: React.FC = () => {
  const { path } = useGovernor();

  useGovWindowTitle(`Locker`);
  return (
    <GovernancePage title="Vote Locker">
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
        <div className="w-full md:basis-[300px] flex flex-col gap-4 flex-shrink-0">
          <EscrowInfo />
          <Card>
            <div className="px-7 py-5">
              <Link to={`/tribeca${path}/proposals/create`}>
                <Button size="md" className="w-full" variant="primary">
                  Create Proposal
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <div className="flex-grow[2] flex flex-col gap-4">
          <LockupDetails />
          <LockerSnapshotsBasic />
        </div>
      </div>
    </GovernancePage>
  );
};
