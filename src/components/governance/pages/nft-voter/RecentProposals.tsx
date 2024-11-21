import { useGovernor } from "@/src/hooks/governance/useGovernor";
import { Card } from "@/src/components/governance/Card";
import { ProposalsList } from "./ProposalsList";

export const RecentProposals: React.FC = () => {
  const { path } = useGovernor();
  return (
    <Card
      title="Recent Proposals"
      link={{
        title: "View all proposals",
        href: `${path}/proposals`,
      }}
    >
      <ProposalsList maxCount={3} />
    </Card>
  );
};
