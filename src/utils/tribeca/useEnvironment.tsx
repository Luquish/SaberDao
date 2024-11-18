import type { Network } from "@saberhq/solana-contrib";
import { ChainId, networkToChainId } from "@saberhq/token-utils";
import * as Sentry from "@sentry/react";
import { useEffect, useMemo } from "react";
import { createContainer } from "unstated-next";

import { SOLE_NETWORK } from "../../contexts/wallet";
import type { IEnvironment } from "./environments";
import { environments } from "./environments";

export const envs = {
  "mainnet-beta": ChainId.MainnetBeta,
  devnet: ChainId.Devnet,
  testnet: ChainId.Testnet,
} as const;

interface UseEnvironment {
  loading: boolean;
  name: string;
  endpoint: string;

  chainId: ChainId | null;
  environments: { [N in Network]: IEnvironment };
  network: Network;
}

const useEnvironmentInternal = (): UseEnvironment => {
  const network = SOLE_NETWORK ?? "mainnet-beta";
  useEffect(() => {
    Sentry.setContext("network", {
      network,
    });
  }, [network]);

  const environment: IEnvironment = environments[network];
  const chainId: ChainId = useMemo(() => networkToChainId(network), [network]);

  return {
    loading: false,
    name: environment.name,
    endpoint: environment.endpoint,
    chainId,
    environments,
    network,
  };
};

export const { Provider: EnvironmentProvider, useContainer: useEnvironment } =
  createContainer(useEnvironmentInternal);
