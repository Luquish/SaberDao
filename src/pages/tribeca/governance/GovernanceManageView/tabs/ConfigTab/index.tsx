import { fetchNullableWithSessionCache } from "@rockooor/sail";
import type { Network } from "@saberhq/solana-contrib";
import { formatNetwork } from "@saberhq/solana-contrib";
import { useQuery } from "@tanstack/react-query";
import { BsGear } from "react-icons/bs";
import React from 'react';

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { CardWithImage } from "@/components/tribeca/common/governance/CardWithImage";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";

const makeAPIUrl = (network: Network, slug: string): string =>
  `https://api.github.com/repos/TribecaHQ/tribeca-registry/contents/config/${formatNetwork(
    network
  )}/${slug}/Tribeca.toml`;

export const ConfigTab: React.FC = () => {
  const { meta } = useGovernor();
  const { network } = useEnvironment();

  const { data: configToml } = useQuery({
    queryKey: ["daoToml", network, meta?.slug],
    queryFn: async () => {
      if (!meta) {
        return meta;
      }
      const data = await fetchNullableWithSessionCache<{
        content: string;
      }>(makeAPIUrl(network, meta?.slug));
      if (!data) {
        return data;
      }
      return Buffer.from(data.content, "base64").toString("utf-8");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <CardWithImage
        title="Configure your DAO"
        image={
          <div className="flex items-center justify-center h-full">
            <BsGear className="w-20 h-20" />
          </div>
        }
      >
        <ProseSmall>
          <p>
            Your DAO manifest controls the features available to members of your
            DAO.
          </p>
          <ExternalLink href="https://github.com/tribecahq/tribeca-registry">
            Learn more
          </ExternalLink>
        </ProseSmall>
      </CardWithImage>
      <Card
        title={
          <>
            <span>DAO Configuration</span>
            <a
              href={`https://github.com/TribecaHQ/tribeca-registry/edit/master/config/${formatNetwork(
                network
              )}/${meta?.slug ?? ""}/Tribeca.toml`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Edit</Button>
            </a>
          </>
        }
        titleClassName="w-full items-center justify-between"
        padded
      >
        <div className="overflow-x-scroll whitespace-nowrap">
          <ProseSmall>
            <pre>{configToml}</pre>
          </ProseSmall>
        </div>
      </Card>
    </div>
  );
};

export default ConfigTab;
