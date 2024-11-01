import { useQuery } from "@tanstack/react-query";
import { findSaveAddress } from "@tribecahq/save";

import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useBatchedSAVEs } from "../../../../../utils/parsers";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { NotFoundPage } from "../../../../common/NotFoundPage";
import { AboutSAVE } from "../common/AboutSAVE";
import { SAVECard } from "./SAVECard";

export const SAVESListView: React.FC = () => {
  const { meta } = useGovernor();
  const saveMints = meta?.saves?.map((save) => save.mint);
  const { data: saveKeys } = useQuery({
    queryKey: ["saveKeysOfMints", saveMints?.map((sm) => sm.toString())],
    queryFn: async () => {
      if (!saveMints) {
        return null;
      }
      return await Promise.all(
        saveMints.map(async (saveMint) => {
          const [save] = await findSaveAddress(saveMint);
          return save;
        })
      );
    },
  });
  const { data: savesData } = useBatchedSAVEs(saveKeys);

  useGovWindowTitle(`Outstanding SAVEs`);
  return (
    <div>
      <GovernancePage title="SAVE Tokens">
        <div tw="flex flex-col gap-8">
          <Card title="Outstanding SAVEs" tw="flex-1">
            {savesData ? (
              savesData.map((saveData) =>
                saveData ? (
                  <SAVECard
                    key={saveData.publicKey.toString()}
                    data={saveData}
                  />
                ) : null
              )
            ) : savesData === undefined ? (
              <div>
                <LoadingPage />
              </div>
            ) : (
              <div>
                <NotFoundPage />
              </div>
            )}
          </Card>
          <AboutSAVE />
        </div>
      </GovernancePage>
    </div>
  );
};

export default SAVESListView;
