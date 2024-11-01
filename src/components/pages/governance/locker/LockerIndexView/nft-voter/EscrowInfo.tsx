import { Card } from "../../../../../common/governance/Card";

interface Props {
  className?: string;
}

export const EscrowInfo: React.FC<Props> = ({ className }: Props) => {
  return <Card className={className} title="Voting Wallet"></Card>;
};
