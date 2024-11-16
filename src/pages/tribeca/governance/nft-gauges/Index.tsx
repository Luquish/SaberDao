import { useGovWindowTitle } from "../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { MarinadeMigration } from "../../../common/MarinadeMigration";

interface Props {
  label: string;
}

const Index: React.FC<Props> = ({ label }: Props) => {
  useGovWindowTitle(`${label} Gauges`);
  return (
    <GovernancePage
      title={`${label} Gauges`}
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    />
  );
};

export default Index;
