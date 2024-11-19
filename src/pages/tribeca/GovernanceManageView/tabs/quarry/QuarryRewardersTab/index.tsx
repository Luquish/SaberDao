import { useBatchedRewarders } from "@rockooor/react-quarry";
import { exists } from "@saberhq/solana-contrib";
import { FaHammer } from "react-icons/fa";
import React from "react";

import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import TableCardBody from "@/components/tribeca/common/card/TableCardBody";
import Card from "@/components/tribeca/common/governance/Card";
import CardWithImage from "@/components/tribeca/common/governance/CardWithImage";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import RewarderCard from "./RewarderCard";

const QuarryRewardersTab: React.FC = () => {
  const { meta, daoName } = useGovernor();
  const allRewarderKeys = [
    meta?.quarry?.rewarder,
    ...(meta?.quarry?.additionalRewarders ?? []),
  ].filter(exists);

  const { data: allRewarders } = useBatchedRewarders(allRewarderKeys);
  const { ownerInvokerKey } = useExecutiveCouncil();

  return (
    <div className="flex flex-col gap-4">
      <Card title={`${daoName ?? "DAO"} Rewards Programs`}>
        <div className="overflow-x-scroll whitespace-nowrap">
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
          <div className="flex items-center justify-center h-full">
            <FaHammer className="h-20 w-20" />
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
