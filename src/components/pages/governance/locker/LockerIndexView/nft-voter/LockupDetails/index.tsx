import { Card } from "../../../../../../common/governance/Card";

interface Props {
  className?: string;
}

export const LockupDetails: React.FC<Props> = ({ className }: Props) => {
  return <Card className={className} />;
};
