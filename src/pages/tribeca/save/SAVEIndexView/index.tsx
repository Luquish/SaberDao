import { usePubkey, useToken } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
import { findSaveAddress } from "@tribecahq/save";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { useSAVEData } from "@/utils/tribeca/parsers";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import Card from "@/components/tribeca/common/governance/Card";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import { NotFoundPage } from "@/components/tribeca/common/NotFoundPage";
import IssueSAVEForm from "./IssueSAVEForm";
import LockSAVEForm from "./LockSAVEForm";
import SAVEDetails from "./SAVEDetails";
import { getUrlParams } from "@/utils/tribeca/urlParams";

export const SAVEIndexView: React.FC = () => {
  const { path, govToken, daoName } = useGovernor();
  const location = useLocation();
  const saveMintStr = getUrlParams.save(location.pathname);
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
          <div className="h-6 flex items-center dark:text-warmGray-400 text-sm font-semibold">
            {saveMintKey ? (
              <AddressLink
                className="dark:text-warmGray-400"
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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <Card title="Issue SAVE Tokens">
                  <div className="px-7 py-5">
                    <IssueSAVEForm saveData={saveData} />
                  </div>
                </Card>
                <Card title="Lock SAVE Tokens">
                  <div className="px-7 py-5">
                    <LockSAVEForm saveData={saveData} />
                  </div>
                </Card>
              </div>
            </div>
            <div className="flex-1">
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
