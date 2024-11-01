import { mapSome } from "@saberhq/solana-contrib";
import { sum } from "lodash-es";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import tw from "twin.macro";

import { FORMAT_DOLLARS } from "../../../../../utils/format";
import { HelpTooltip } from "../../../../common/HelpTooltip";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";
import { useCashioHackUBOFullInfo } from "../../address/CashioVerifyPage/useCashioHackUBOInfo";
import type { RawCashioSubmission } from "./useSubmissions";
import { useCashioHackReview } from "./useSubmissions";

interface Props {
  submission: RawCashioSubmission;
}

export const CASHIO_REFUND_ETH_PRICE = 3055.19;

export const CashioRefundSubmissionRow: React.FC<Props> = ({
  submission,
}: Props) => {
  const { data: uboInfo } = useCashioHackUBOFullInfo(submission.owner ?? "");

  const { data: cashioHackReview } = useCashioHackReview();
  const review = mapSome(
    cashioHackReview,
    (c) => c[submission.selfReportedAddress]
  );

  const decision = review?.decision ?? "Needs Review";

  const link = submission.owner ? (
    <Link to={`/address/${submission.owner}/cashio`}>{submission.owner}</Link>
  ) : (
    submission.selfReportedAddress
  );

  const decisionNode = (
    <span
      tw="font-semibold"
      css={[
        decision === "Approved" && tw`text-green-500`,
        decision === "Rejected" && tw`text-red-500`,
        decision === "Needs Review" && tw`text-yellow-500`,
        decision === "Under Review" && tw`text-cyan-500`,
      ]}
    >
      {decision}
    </span>
  );

  return (
    <tr>
      <td>{link}</td>
      <td>
        {review?.reason ? (
          <HelpTooltip
            text={<div tw="whitespace-pre-wrap">{review.reason}</div>}
          >
            {decisionNode}
          </HelpTooltip>
        ) : (
          decisionNode
        )}
      </td>
      <td>
        <div tw="flex items-center">
          <span tw="text-white font-semibold">
            {mapSome(uboInfo, (u) =>
              u.summary.netLosses.toLocaleString(undefined, FORMAT_DOLLARS)
            )}
          </span>
          {(uboInfo?.solanaAddresses?.length ?? 0) >= 2 && (
            <MouseoverTooltip
              text={`This user had multiple submissions: ${
                uboInfo?.solanaAddresses.join(", ") ?? ""
              }. To avoid double counting, their net losses have been adjusted for this submission.`}
            >
              <FaExclamationTriangle tw="text-yellow-500 inline w-3.5 h-3.5 ml-1.5" />
            </MouseoverTooltip>
          )}
        </div>
      </td>
      <td>
        {mapSome(uboInfo, (u) =>
          u.summary.totalLosses.toLocaleString(undefined, FORMAT_DOLLARS)
        )}
      </td>
      <td>
        {mapSome(uboInfo, (u) =>
          u.summary.totalRefunds.toLocaleString(undefined, FORMAT_DOLLARS)
        )}
      </td>
      <td>
        {mapSome(uboInfo, (u) => {
          return (
            <div tw="flex flex-col gap-0.5">
              <span
                css={[u.summary.ethRefundPercent && tw`text-white font-medium`]}
              >
                {u.summary.totalEthRefunds.toLocaleString(
                  undefined,
                  FORMAT_DOLLARS
                )}{" "}
                (
                {u.summary.ethRefundPercent?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  style: "percent",
                })}
                )
              </span>
              <span>
                (
                {sum(
                  u.ethReimbursements.map((er) => parseFloat(er.value))
                ).toLocaleString()}
                Ξ @{" "}
                {CASHIO_REFUND_ETH_PRICE.toLocaleString(
                  undefined,
                  FORMAT_DOLLARS
                )}
                )
              </span>
            </div>
          );
        })}
      </td>
      <td>{mapSome(uboInfo, (u) => u.submission?.balance)}</td>
    </tr>
  );
};
