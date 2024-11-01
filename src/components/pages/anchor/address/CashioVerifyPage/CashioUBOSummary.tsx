import type { PublicKey } from "@solana/web3.js";
import { FaExclamationTriangle } from "react-icons/fa";

import { FORMAT_DOLLARS } from "../../../../../utils/format";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";
import { useCashioHackUBOFullInfo } from "./useCashioHackUBOInfo";

interface Props {
  ubo: PublicKey;
}

export const CashioUBOSummary: React.FC<Props> = ({ ubo }: Props) => {
  const { data } = useCashioHackUBOFullInfo(ubo.toString());
  return (
    <Card title="Summary" bodyScrollX>
      <TableCardBody>
        <tr>
          <th tw="align-top!">Confirmed Losses</th>
          <td>
            <div tw="flex flex-col gap-2">
              {data?.tokenAccounts
                .filter((ta) => ta.amount !== 0)
                .map((ta) => (
                  <div key={ta.account.toString()} tw="flex flex-col gap-0.5">
                    <span>
                      {ta.amount.toLocaleString(undefined, {
                        minimumSignificantDigits: 1,
                      })}{" "}
                      {ta.tokenName}
                    </span>
                    <span tw="text-gray-400 font-medium">
                      {ta.usdValue?.toLocaleString(undefined, FORMAT_DOLLARS)} @{" "}
                      {ta.price?.toLocaleString(undefined, {
                        ...FORMAT_DOLLARS,
                        minimumSignificantDigits: 1,
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </td>
        </tr>
        <tr>
          <th tw="align-top!">Total Losses</th>
          <td>
            {data?.summary.totalLosses.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </td>
        </tr>
        <tr>
          <th tw="align-top!">Total Refunds (on Solana)</th>
          <td>
            {data?.summary.totalRefunds.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </td>
        </tr>
        <tr>
          <th tw="align-top!">Total Refunds (ETH)</th>
          <td>
            {data?.summary.totalEthRefunds.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}{" "}
            (
            {data?.summary.ethRefundPercent?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              style: "percent",
            })}
            )
          </td>
        </tr>
        <tr>
          <th tw="align-top! text-primary!">
            Net Losses (amount to reimburse)
          </th>
          <td>
            <div tw="flex items-center">
              <span tw="text-primary font-semibold">
                {data?.summary.netLosses.toLocaleString(
                  undefined,
                  FORMAT_DOLLARS
                )}
              </span>
              {(data?.solanaAddresses.length ?? 0) >= 2 && (
                <MouseoverTooltip
                  text={`This user had multiple submissions: ${
                    data?.solanaAddresses.join(", ") ?? ""
                  }. To avoid double counting, their net losses have been adjusted for this submission.`}
                >
                  <FaExclamationTriangle tw="text-yellow-500 inline w-3.5 h-3.5 ml-1.5" />
                </MouseoverTooltip>
              )}
            </div>
          </td>
        </tr>
      </TableCardBody>
    </Card>
  );
};
