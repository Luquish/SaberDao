import tw from "twin.macro";

import type { ProposalInfo } from "../../../../../../hooks/tribeca/useProposals";
import { Card } from "../../../../../common/governance/Card";
import { IXSummary } from "../../../../../common/governance/IXSummary";
import { TransactionPreviewLink } from "../../../../../common/governance/TransactionPreviewLink";
import { ExternalLink } from "../../../../../common/typography/ExternalLink";

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
          <div key={i} tw="px-7 py-5 border-b border-warmGray-800 flex">
            <div tw="w-10 text-warmGray-600 font-medium">{i + 1}</div>
            <div tw="text-white flex-1">
              <IXSummary instruction={ix} />
            </div>
          </div>
        ))}
      </div>
      <div tw="p-7">
        {proposalInfo &&
          !proposalInfo.status.executed &&
          proposalInfo.proposalData.instructions.length > 0 && (
            <TransactionPreviewLink
              instructions={proposalInfo.proposalData.instructions}
            />
          )}
        <div css={[!proposalInfo?.status.executed && tw`mt-7`]}>
          <article tw="flex flex-col">
            <span>{description}</span>
            {discussionLink && (
              <ExternalLink tw="my-4 text-base" href={discussionLink}>
                View Discussion
              </ExternalLink>
            )}
          </article>
        </div>
      </div>
    </Card>
  );
};
