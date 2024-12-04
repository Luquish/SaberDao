import { useGovernor } from "@/hooks/governance/useGovernor";
import { Card } from "@/components/governance/Card";
import { ProposalsList } from "./nft-voter/ProposalsList";

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
