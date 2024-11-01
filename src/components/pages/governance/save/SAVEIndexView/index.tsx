import { usePubkey, useToken } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
import { findSaveAddress } from "@tribecahq/save";
import { useParams } from "react-router-dom";

import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useSAVEData } from "../../../../../utils/parsers";
import { AddressLink } from "../../../../common/AddressLink";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { NotFoundPage } from "../../../../common/NotFoundPage";
import { IssueSAVEForm } from "./IssueSAVEForm";
import { LockSAVEForm } from "./LockSAVEForm";
import { SAVEDetails } from "./SAVEDetails";

export const SAVEIndexView: React.FC = () => {
  const { path, govToken, daoName } = useGovernor();
  const { saveMintStr } = useParams<{ saveMintStr: string }>();
  const saveMintKey = usePubkey(saveMintStr);
  const { data: saveToken } = useToken(saveMintKey);
  const { data: saveKey } = useQuery({
    queryKey: ["saveMint", saveMintKey?.toString()],
    queryFn: async () => {
      if (!saveMintKey) {
        return null;
      }
      const [save] = await findSaveAddress(saveMintKey);
      return save;
    },
  });
  const { data: saveData } = useSAVEData(saveKey);

  const tokenName =
    saveToken?.name ?? `${govToken?.symbol ?? daoName ?? "DAO"} SAVE Token`;

  useGovWindowTitle(`Issue ${tokenName}`);
  return (
    <div>
      <GovernancePage
        backLink={{
          label: "SAVEs",
          href: `${path}/saves`,
        }}
        title={`Issue ${tokenName}`}
        header={
          <div tw="h-6 flex items-center dark:text-warmGray-400 text-sm font-semibold">
            {saveMintKey ? (
              <AddressLink
                tw="dark:text-warmGray-400"
                address={saveMintKey}
                showCopy
              />
            ) : (
              <div>--</div>
            )}
          </div>
        }
      >
        {saveData ? (
          <div tw="flex flex-col md:flex-row gap-8">
            <div tw="flex-1">
              <div tw="flex flex-col gap-4">
                <Card title="Issue SAVE Tokens">
                  <div tw="px-7 py-5">
                    <IssueSAVEForm saveData={saveData} />
                  </div>
                </Card>
                <Card title="Lock SAVE Tokens">
                  <div tw="px-7 py-5">
                    <LockSAVEForm saveData={saveData} />
                  </div>
                </Card>
              </div>
            </div>
            <div tw="flex-1">
              <Card title="About">
                <SAVEDetails saveData={saveData} />
              </Card>
            </div>
          </div>
        ) : saveData === undefined ? (
          <div>
            <LoadingPage />
          </div>
        ) : (
          <div>
            <NotFoundPage />
          </div>
        )}
      </GovernancePage>
    </div>
  );
};

export default SAVEIndexView;
