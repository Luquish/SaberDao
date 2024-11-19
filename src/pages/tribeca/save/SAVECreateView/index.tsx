import React from "react";

import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import Card from "@/components/tribeca/common/governance/Card";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import AboutSAVE from "@/pages/tribeca/save/common/AboutSAVE";
import CreateSAVEForm from "@/pages/tribeca/save/SAVECreateView/CreateSAVEForm";

const SAVECreateView: React.FC = () => {
  const { path } = useGovernor();

  useGovWindowTitle(`Create SAVE Token`);
  return (
    <GovernancePage
      backLink={{
        label: "SAVEs",
        href: `${path}/saves`,
      }}
      title="Create a Class of SAVEs"
    >
      <div className="flex flex-col gap-8">
        <Card title="Create SAVE">
          <div>
            <CreateSAVEForm />
          </div>
        </Card>
        <AboutSAVE />
      </div>
    </GovernancePage>
  );
};

export default SAVECreateView;
