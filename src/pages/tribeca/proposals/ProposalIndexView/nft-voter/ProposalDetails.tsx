import React from 'react';

import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { Card } from "@/components/tribeca/common/governance/Card";
import { IXSummary } from "@/components/tribeca/common/governance/IXSummary";
import { TransactionPreviewLink } from "@/components/tribeca/common/governance/TransactionPreviewLink";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import { InstructionData } from '@/hooks/tribeca/tx/useParsedInstruction';

interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

export const ProposalDetails: React.FC<Props> = ({
  className,
  proposalInfo,
}: Props) => {
  const descriptionRaw = proposalInfo?.proposalMetaData?.descriptionLink ?? "";
  const description = descriptionRaw.substring(
    0,
    descriptionRaw.lastIndexOf("[")
  );
  const discussionLink = descriptionRaw.substring(
    descriptionRaw.lastIndexOf("(") + 1,
    descriptionRaw.lastIndexOf(")")
  );

  return (
    <Card className={className} title="Details">
      <div>
        {proposalInfo?.proposalData.instructions.map((ix, i) => (
          <div key={i} className="px-7 py-5 border-b border-warmGray-800 flex">
            <div className="w-10 text-warmGray-600 font-medium">{i + 1}</div>
            <div className="text-white flex-1">
              <IXSummary instruction={ix} />
            </div>
          </div>
        ))}
      </div>
      <div className="p-7">
        {proposalInfo &&
          !proposalInfo.status.executed &&
          proposalInfo.proposalData.instructions.length > 0 && (
            <TransactionPreviewLink
              instructions={proposalInfo.proposalData.instructions}
            />
          )}
        <div className={!proposalInfo?.status.executed ? "mt-7" : ""}>
          <article className="flex flex-col">
            <span>{description}</span>
            {discussionLink && (
              <ExternalLink className="my-4 text-base" href={discussionLink}>
                View Discussion
              </ExternalLink>
            )}
          </article>
        </div>
      </div>
    </Card>
  );
};
