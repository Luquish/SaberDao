import { mapSome } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import { Link } from "react-router-dom";
import tw from "twin.macro";

import { FORMAT_DOLLARS_WHOLE } from "../../../../../utils/format";
import { Badge } from "../../../../common/Badge";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { HelpTooltip } from "../../../../common/HelpTooltip";
import { Textarea } from "../../../../common/inputs/InputText";
import type { RawCashioSubmission } from "../../cashio/CashioSubmissionsPage/useSubmissions";
import { useCashioHackReview } from "../../cashio/CashioSubmissionsPage/useSubmissions";

interface Props {
  title?: string;
  submission: RawCashioSubmission;
}

export const CashioRefundSubmission: React.FC<Props> = ({
  title,
  submission,
}: Props) => {
  const { data: cashioHackReview } = useCashioHackReview();
  const review = mapSome(
    cashioHackReview,
    (c) => c[submission.selfReportedAddress]
  );

  const estimatedLosses =
    mapSome(review?.estimatedDollarValue, (r) =>
      r.toLocaleString(undefined, FORMAT_DOLLARS_WHOLE)
    ) ??
    submission.balance ??
    "(could not parse)";

  const decision = review?.decision ?? "Needs Review";

  const maybeSub = submission.owner ? new PublicKey(submission.owner) : null;
  return (
    <Card
      title={title ?? submission.selfReportedAddress}
      tw="text-sm"
      bodyScrollX
    >
      <TableCardBody rightAlignEnd>
        <tr>
          <th tw="align-top!">
            <HelpTooltip
              text={
                <ul>
                  <li>Approved - the task force validated the data</li>
                  <li>
                    Rejected - the task force determined that the submission was
                    invalid
                  </li>
                  <li>
                    Needs Review - the task force has insufficient information
                    to verify the data
                  </li>
                </ul>
              }
            >
              Review Status
            </HelpTooltip>
          </th>
          <td>
            <span
              tw="font-semibold"
              css={[
                decision === "Approved" && tw`text-green-500`,
                decision === "Rejected" && tw`text-red-500`,
                decision === "Needs Review" && tw`text-yellow-500`,
              ]}
            >
              {decision}
            </span>
            {review?.reason && (
              <div tw="mt-4 whitespace-pre-wrap text-left p-4 border border-warmGray-700 rounded bg-warmGray-850">
                <code>{review.reason}</code>
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>Estimated Losses (may not be precise/accurate)</th>
          <td>
            <div>
              {estimatedLosses}
              <div tw="inline-block">
                {review?.over100K === true && (
                  <Badge tw="ml-2 bg-primary-700 text-primary-200">
                    &gt;$100K
                  </Badge>
                )}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>Message Signer</th>
          <td>
            {maybeSub ? (
              <div>
                <span tw="font-mono">{maybeSub.toString()}</span>
                <Link
                  tw="ml-4 text-primary hover:text-white transition-colors"
                  to={`/address/${maybeSub.toString()}/cashio`}
                >
                  (view balances)
                </Link>
              </div>
            ) : (
              <span tw="text-red-500">No signature found</span>
            )}
          </td>
        </tr>
        <tr>
          <th tw="align-top!">Submission</th>
          <td>
            <div tw="whitespace-pre-wrap text-left p-4 border border-warmGray-700 rounded bg-warmGray-850">
              <code>{submission.messageText}</code>
            </div>
          </td>
        </tr>
        {submission.rawSignature && (
          <tr>
            <th>
              <div tw="flex flex-col gap-2">
                <span>Signature (base64)</span>
                <div tw="font-normal">
                  {submission.signatureIsVerified ? (
                    <span tw="text-primary">Verified</span>
                  ) : (
                    <span tw="text-red-500">Invalid</span>
                  )}
                </div>
              </div>
            </th>
            <td>
              <code>{submission.rawSignature}</code>
            </td>
          </tr>
        )}
        {submission.rawMessage && (
          <tr>
            <th>Message (base64)</th>
            <td>
              <Textarea
                readOnly
                spellCheck={false}
                tw="w-full h-20 font-mono"
                rows={9}
                value={submission.rawMessage}
              />
            </td>
          </tr>
        )}
      </TableCardBody>
    </Card>
  );
};
