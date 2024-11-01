import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { AboutSAVE } from "../common/AboutSAVE";
import { CreateSAVEForm } from "./CreateSAVEForm";

export const SAVECreateView: React.FC = () => {
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
      <div tw="flex flex-col gap-8">
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
