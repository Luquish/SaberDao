import type { PublicKey } from "@solana/web3.js";

import { useSubmission } from "../../cashio/CashioSubmissionsPage/useSubmissions";
import { CashioRefundSubmission } from "./CashioRefundSubmission";

interface Props {
  owner: PublicKey;
}

export const SubmissionWrapper: React.FC<Props> = ({ owner }: Props) => {
  const { data: submission } = useSubmission(owner.toString());
  if (!submission) {
    return <></>;
  }
  return <CashioRefundSubmission title="Submission" submission={submission} />;
};
