import { mapSome } from "@saberhq/solana-contrib";
import { useState } from "react";
import tw from "twin.macro";

import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { Toggle } from "../../../../common/Toggle";
import { Prose } from "../../../../common/typography/Prose";
import { AnchorLayout } from "../../../../layout/AnchorLayout";
import { useAllCashioUBOsFull } from "../../address/CashioVerifyPage/useCashioHackUBOInfo";
import { CashioRefundSubmissionRow } from "./CashioRefundSubmissionRow";
import { useAllSubmissions, useCashioHackReview } from "./useSubmissions";

export const CashioSubmissionsPage: React.FC = () => {
  const { data: ubos } = useAllCashioUBOsFull();
  const { data: submissionsUnfiltered } = useAllSubmissions();
  const { data: cashioHackReview } = useCashioHackReview();

  const [showRejected, setShowRejected] = useState<boolean>(false);
  const [showUnder100K, setShowUnder100K] = useState<boolean>(false);

  const submissions = mapSome(submissionsUnfiltered, (s) => {
    return s
      .filter((sub) => {
        const review = cashioHackReview?.[sub.selfReportedAddress];
        const summary = ubos?.[sub.selfReportedAddress]?.summary;
        return [
          showRejected ? true : review?.decision !== "Rejected",
          showUnder100K
            ? true
            : review?.over100K === true ||
              (summary && summary.netLosses > 100_000),
        ].every((s) => !!s);
      })
      .sort(({ selfReportedAddress: a }, { selfReportedAddress: b }) => {
        const summaryA = ubos?.[a]?.summary;
        const summaryB = ubos?.[b]?.summary;

        if (!summaryA) {
          return 1;
        }
        if (!summaryB) {
          return -1;
        }
        return summaryB.netLosses - summaryA.netLosses;
      });
  });

  return (
    <AnchorLayout
      title="Cashio Refund Submissions"
      description={
        <div>
          <Prose>
            <p>
              A list of all submissions to the{" "}
              <a
                href="https://refund.cashio.app"
                target="_blank"
                rel="noreferrer"
              >
                Cashio refunds page.
              </a>{" "}
              Review and flag any potential issues or discrepancies on our
              Discord channel{" "}
              <a
                href="https://discord.gg/fx58EDftnz"
                target="_blank"
                rel="noreferrer"
              >
                #❗submission-alerts
              </a>
            </p>
            <p>
              All submissions have been reviewed manually and with onchain
              automations to make sure our numbers are accurate.
            </p>
          </Prose>
        </div>
      }
    >
      <div tw="flex flex-col gap-8">
        <Card
          title={
            <>
              <div>
                <span tw="font-bold text-white text-base">
                  Viewing {submissions?.length} refund submissions
                </span>
              </div>
              <div tw="flex gap-4">
                <Toggle
                  label="Show Rejected"
                  checked={showRejected}
                  onChange={(v) => setShowRejected(v)}
                />
                <Toggle
                  label="Show <$100K"
                  checked={showUnder100K}
                  onChange={(v) => setShowUnder100K(v)}
                />
              </div>
            </>
          }
          titleStyles={tw`flex justify-between`}
          bodyScrollX
        >
          <TableCardBody
            head={
              <tr>
                <th>Address</th>
                <th>Decision</th>
                <th>Net Confirmed Loss</th>
                <th>Total Losses</th>
                <th>Total Refunded (on Solana)</th>
                <th>Total Refunded (ETH)</th>
                <th>Losses (self-reported)</th>
              </tr>
            }
          >
            {submissions?.map((sub, i) => {
              return <CashioRefundSubmissionRow key={i} submission={sub} />;
            })}
          </TableCardBody>
        </Card>
      </div>
    </AnchorLayout>
  );
};

export default CashioSubmissionsPage;
