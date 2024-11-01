import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import tw from "twin.macro";

import { useExecutiveCouncil } from "../../../../hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { Button } from "../../../common/Button";
import { Card } from "../../../common/governance/Card";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { TabNav } from "./TabNav";

export const GovernanceManageView: React.FC = () => {
  const { path, daoName } = useGovernor();
  const { isMemberOfEC } = useExecutiveCouncil();
  return (
    <GovernancePage title="Manage" containerStyles={tw`max-w-7xl`}>
      {isMemberOfEC ? (
        <div tw="flex flex-col md:flex-row gap-8">
          <TabNav />
          <div tw="flex-1">
            <Outlet />
          </div>
        </div>
      ) : (
        <Card title="Unauthorized" padded>
          <div tw="flex flex-col items-center gap-4 my-4">
            <img
              src="/images/tribeca/unauthorized.jpeg"
              alt="Stop right here."
            />
            <p>
              You must be on the {daoName} Executive Council to view this page.
            </p>
            <Link to={path}>
              <Button>Return to Home</Button>
            </Link>
          </div>
        </Card>
      )}
    </GovernancePage>
  );
};

export default GovernanceManageView;
