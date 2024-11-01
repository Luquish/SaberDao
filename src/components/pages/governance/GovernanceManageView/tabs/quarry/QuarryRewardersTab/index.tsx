import { useBatchedRewarders } from "@rockooor/react-quarry";
import { exists } from "@saberhq/solana-contrib";
import { FaHammer } from "react-icons/fa";

import { useExecutiveCouncil } from "../../../../../../../hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "../../../../../../../hooks/tribeca/useGovernor";
import { AddressLink } from "../../../../../../common/AddressLink";
import { TableCardBody } from "../../../../../../common/card/TableCardBody";
import { Card } from "../../../../../../common/governance/Card";
import { CardWithImage } from "../../../../../../common/governance/CardWithImage";
import { ProseSmall } from "../../../../../../common/typography/Prose";
import { RewarderCard } from "./RewarderCard";

export const QuarryRewardersTab: React.FC = () => {
  const { meta, daoName } = useGovernor();
  const allRewarderKeys = [
    meta?.quarry?.rewarder,
    ...(meta?.quarry?.additionalRewarders ?? []),
  ].filter(exists);

  const { data: allRewarders } = useBatchedRewarders(allRewarderKeys);
  const { ownerInvokerKey } = useExecutiveCouncil();

  return (
    <div tw="flex flex-col gap-4">
      <Card title={`${daoName ?? "DAO"} Rewards Programs`}>
        <div tw="overflow-x-scroll whitespace-nowrap">
          <TableCardBody
            head={
              <tr>
                <th>Rewarder</th>
                <th>Rewards</th>
                <th>Roles</th>
              </tr>
            }
          >
            {allRewarders?.map((rewarder) => {
              if (!rewarder) {
                return null;
              }
              return (
                <RewarderCard
                  key={rewarder?.publicKey.toString()}
                  rewarder={rewarder}
                />
              );
            })}
          </TableCardBody>
        </div>
      </Card>
      <CardWithImage
        title="Manage your Quarries with Tribeca"
        image={
          <div tw="flex items-center justify-center h-full">
            <FaHammer tw="h-20 w-20" />
          </div>
        }
      >
        <ProseSmall>
          <p>
            Grant your Executive Council's owner invoker permissions to set
            rates, create quarries, and allocate shares.
          </p>
          {ownerInvokerKey && (
            <p>
              Owner Invoker: <AddressLink address={ownerInvokerKey} showCopy />
            </p>
          )}
        </ProseSmall>
      </CardWithImage>
    </div>
  );
};

export default QuarryRewardersTab;
