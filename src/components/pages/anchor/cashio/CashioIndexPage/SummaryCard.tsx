import { mapSome } from "@saberhq/solana-contrib";
import { sum } from "lodash-es";

import { FORMAT_DOLLARS } from "../../../../../utils/format";
import { Card } from "../../../../common/governance/Card";
import { ProseSmall } from "../../../../common/typography/Prose";
import { useAllCashioUBOsFull } from "../../address/CashioVerifyPage/useCashioHackUBOInfo";

export const SummaryCard: React.FC = () => {
  const { data } = useAllCashioUBOsFull();
  const summary = mapSome(data, (d) => {
    const allAccounts = Object.values(d);
    const withSubmissions = allAccounts.filter((a) => a.submission);
    const affectedAccounts = allAccounts.filter(
      (account) => account.summary.totalLosses > 0
    );
    const submittedAccounts = allAccounts.filter(
      (account) => account.submission && account.review?.decision === "Approved"
    );

    const totalSummary = {
      all: {
        totalLosses: sum(allAccounts.map((a) => a.summary.totalLosses)),
        totalRefunds: sum(allAccounts.map((a) => a.summary.totalRefunds)),
        totalEthRefunds: sum(allAccounts.map((a) => a.summary.totalEthRefunds)),
        netLosses: sum(allAccounts.map((a) => a.summary.netLosses)),
      },
      claims: {
        totalLosses: sum(withSubmissions.map((a) => a.summary.totalLosses)),
        totalRefunds: sum(withSubmissions.map((a) => a.summary.totalRefunds)),
        totalEthRefunds: sum(
          withSubmissions.map((a) => a.summary.totalEthRefunds)
        ),
        netLosses: sum(withSubmissions.map((a) => a.summary.netLosses)),
      },
      totalAffected: affectedAccounts.length,
      totalSubmissions: submittedAccounts.length,
      totalRefunded: affectedAccounts.filter(
        (account) =>
          account.summary.netLosses / account.summary.totalLosses < 0.05
      ).length,
      totalSubmissionsRefunded: submittedAccounts.filter(
        (account) =>
          account.summary.netLosses / account.summary.totalLosses < 0.05
      ).length,
    };
    return totalSummary;
  });

  return (
    <Card title="Summary" padded>
      <ProseSmall>
        <strong>Summary</strong>
        <ul>
          <li># Users Affected - {summary?.totalAffected}</li>
          <li># Users 95% Refunded - {summary?.totalRefunded}</li>
          <li># of Submissions - {summary?.totalSubmissions}</li>
          <li>
            # of Submissions 95% Refunded - {summary?.totalSubmissionsRefunded}
          </li>
        </ul>
        <strong>All Accounts</strong>
        <ul>
          <li>
            Total Losses -{" "}
            {summary?.all.totalLosses.toLocaleString(undefined, FORMAT_DOLLARS)}
          </li>
          <li>
            Total Refunded (on Solana) -{" "}
            {summary?.all.totalRefunds.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </li>
          <li>
            Total Refunded (ETH) -{" "}
            {summary?.all.totalEthRefunds.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </li>
          <li>
            Net Losses -{" "}
            {summary?.all.netLosses.toLocaleString(undefined, FORMAT_DOLLARS)}
          </li>
        </ul>
        <strong>All Claims</strong>
        <ul>
          <li>
            Total Losses -{" "}
            {summary?.claims.totalLosses.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </li>
          <li>
            Total Refunded (on Solana) -{" "}
            {summary?.claims.totalRefunds.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </li>
          <li>
            Total Refunded (ETH) -{" "}
            {summary?.claims.totalEthRefunds.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </li>
          <li>
            Net Losses -{" "}
            {summary?.claims.netLosses.toLocaleString(
              undefined,
              FORMAT_DOLLARS
            )}
          </li>
        </ul>
      </ProseSmall>
    </Card>
  );
};
