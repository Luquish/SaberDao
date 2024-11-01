import { Link } from "react-router-dom";

import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../../hooks/tribeca/useGovernor";
import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { GovernancePage } from "../../../../../common/governance/GovernancePage";
import { EscrowInfo } from "./EscrowInfo";
import { LockerSnapshotsBasic } from "./LockerSnapshotsBasic";
import { LockupDetails } from "./LockupDetails";

export const LockerIndexView: React.FC = () => {
  const { path } = useGovernor();

  useGovWindowTitle(`Locker`);
  return (
    <GovernancePage title="Vote Locker">
      <div tw="flex flex-wrap md:flex-nowrap gap-4 items-start">
        <div tw="w-full md:flex-basis[300px] flex flex-col gap-4 flex-shrink-0">
          <EscrowInfo />
          <Card>
            <div tw="px-7 py-5">
              <Link to={`${path}/proposals/create`}>
                <Button size="md" tw="w-full" variant="primary">
                  Create Proposal
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <div tw="flex-grow[2] flex flex-col gap-4">
          <LockupDetails />
          <LockerSnapshotsBasic />
        </div>
      </div>
    </GovernancePage>
  );
};
