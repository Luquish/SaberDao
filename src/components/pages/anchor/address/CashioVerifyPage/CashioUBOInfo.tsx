import type { PublicKey } from "@solana/web3.js";

import { DATE_FORMATTER } from "../../../../../utils/format";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { EmptyState } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { HelpTooltip } from "../../../../common/HelpTooltip";
import { CashioUBOSummary } from "./CashioUBOSummary";
import { ChestBalance } from "./ChestBalance";
import { EthReimbursementRow } from "./EthReimbursementRow";
import { HistoricalTokenAccountBalance } from "./HistoricalTokenAccountBalance";
import { ReimbursementRow } from "./ReimbursementRow";
import { SubmissionWrapper } from "./SubmissionWrapper";
import { SLOT_OF_HACK, TIME_OF_HACK } from "./useBalanceAtTimeOfHack";
import { useCashioHackUBOFullInfo } from "./useCashioHackUBOInfo";

interface Props {
  ubo: PublicKey;
}

export const CashioUBOInfo: React.FC<Props> = ({ ubo }: Props) => {
  const { data } = useCashioHackUBOFullInfo(ubo.toString());

  return (
    <div tw="flex flex-col gap-8">
      <CashioUBOSummary ubo={ubo} />
      <SubmissionWrapper owner={ubo} />
      <Card title="Affected Accounts" bodyScrollX>
        <TableCardBody
          head={
            <tr>
              <th>Account</th>
              <th>Pre-Hack Balance</th>
              <th>
                <HelpTooltip
                  text={
                    <div tw="flex flex-col gap-0.5 font-normal">
                      <span>
                        The last time funds were moved in this account before
                        the hack.
                      </span>
                      <span tw="text-xs">
                        ({DATE_FORMATTER.format(TIME_OF_HACK)}, slot{" "}
                        {SLOT_OF_HACK.toLocaleString()})
                      </span>
                    </div>
                  }
                >
                  <span tw="underline text-decoration-style[dotted]">
                    Funds Last Moved At
                  </span>
                </HelpTooltip>
              </th>
              <th>Transaction Signature</th>
            </tr>
          }
        >
          {data?.tokenAccounts.map(({ account, type, owner }) => {
            return (
              <HistoricalTokenAccountBalance
                key={account.toString()}
                account={account}
                type={type}
                owner={owner}
              />
            );
          })}
          <ChestBalance ubo={ubo} />
        </TableCardBody>
      </Card>
      <Card title="Reimbursements Received" bodyScrollX>
        <TableCardBody
          head={
            <tr>
              <th>Recipient</th>
              <th>Amount</th>
              <th>Account</th>
              <th>Transaction Signature</th>
            </tr>
          }
        >
          {data?.reimbursements.map((reimbursement) => {
            return (
              <ReimbursementRow
                key={reimbursement.signature}
                reimbursement={reimbursement}
              />
            );
          })}
          {data?.ethReimbursements.map((reimbursement) => {
            return (
              <EthReimbursementRow
                key={reimbursement.tx}
                reimbursement={reimbursement}
              />
            );
          })}
          {data?.reimbursements.length === 0 &&
            data.ethReimbursements.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <EmptyState title="No reimbursements found." />
                </td>
              </tr>
            )}
        </TableCardBody>
      </Card>
    </div>
  );
};
