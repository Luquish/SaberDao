import { mapSome } from "@saberhq/solana-contrib";
import { Link } from "react-router-dom";
import tw from "twin.macro";

import { DATE_FORMATTER } from "../../../../../utils/format";
import { ContentLoader } from "../../../../common/ContentLoader";
import { Card } from "../../../../common/governance/Card";
import { ProseSmall } from "../../../../common/typography/Prose";
import { AnchorLayout } from "../../../../layout/AnchorLayout";
import { TIME_OF_HACK } from "../../address/CashioVerifyPage/useBalanceAtTimeOfHack";
import { useAllCashioUBOs } from "../../address/CashioVerifyPage/useCashioHackUBOInfo";
import { InspectAddressCard } from "./InspectAddressCard";
import { SummaryCard } from "./SummaryCard";

export const CashioIndexPage: React.FC = () => {
  const { data: allUBOs } = useAllCashioUBOs();
  const count = mapSome(allUBOs, (u) => Object.keys(u).length);

  return (
    <AnchorLayout
      title="Cashio Hack Information Portal"
      innerStyles={tw`max-w-lg`}
    >
      <div tw="flex flex-col gap-8">
        <Card title="About" padded>
          <ProseSmall>
            <p>
              A major security incident occured on Cashio Protocol around{" "}
              {DATE_FORMATTER.format(TIME_OF_HACK)}.
            </p>
            <p tw="text-white">
              Currently tracking{" "}
              {mapSome(count, (c) => c.toLocaleString()) ?? (
                <ContentLoader tw="w-4 h-2" />
              )}{" "}
              accounts which held CASH or CASH derivatives.
            </p>
            <p>This page contains various tools surrounding this hack.</p>
            <p>
              You can also view a list of all received submissions{" "}
              <Link to={`/cashio/submissions`}>here</Link>.
            </p>
            <p>
              You may download a combined batch #1+batch #2 CSV of all validated
              submissions{" "}
              <a
                href="https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/approved-submissions.csv"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              .
            </p>
            {/* <ul>
              <li>
                <a
                  href="https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/approved-submissions-batch-1.csv"
                  target="_blank"
                  rel="noreferrer"
                >
                  Batch #1
                </a>
              </li>
              <li>
                <a
                  href="https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/approved-submissions-batch-2.csv"
                  target="_blank"
                  rel="noreferrer"
                >
                  Batch #2
                </a>
              </li>
            </ul> */}
          </ProseSmall>
        </Card>
        <SummaryCard />
        <Card title="Inspect Address" padded>
          <ProseSmall>
            <p tw="mb-4">
              Look up an address to see if it was affected by the hack.
            </p>
            <InspectAddressCard />
          </ProseSmall>
        </Card>
      </div>
    </AnchorLayout>
  );
};

export default CashioIndexPage;
