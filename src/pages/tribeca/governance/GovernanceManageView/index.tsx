import { Router } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useExecutiveCouncil } from "../../../../hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { Button } from "../../../../components/tribeca/common/Button";
import { Card } from "../../../../components/tribeca/common/governance/Card";
import { GovernancePage } from "../../../../components/tribeca/common/governance/GovernancePage";
import { TabNav } from "./TabNav";

export const GovernanceManageView: React.FC = () => {
  const { path, daoName } = useGovernor();
  const { isMemberOfEC } = useExecutiveCouncil();

  return (
    <GovernancePage title="Manage" containerClassName="max-w-7xl">
      {isMemberOfEC ? (
        <div className="flex flex-col md:flex-row gap-8">
          <TabNav />
          <div className="flex-1">
            <Router>
              {/* Aquí irían las rutas anidadas definidas en routes.tsx */}
            </Router>
          </div>
        </div>
      ) : (
        <Card title="Unauthorized" padded>
          <div className="flex flex-col items-center gap-4 my-4">
            <img
              src="/images/tribeca/unauthorized.jpeg"
              alt="Stop right here."
            />
            <p>
              You must be on the {daoName} Executive Council to view this page.
            </p>
            <Link to={`/tribeca${path}`}>
              <Button>Return to Home</Button>
            </Link>
          </div>
        </Card>
      )}
    </GovernancePage>
  );
};

export default GovernanceManageView;
