import { ChainId, networkToChainId } from "@saberhq/token-utils";
import * as Sentry from "@sentry/react";
import { useEffect, useMemo } from "react";
import { createContainer } from "unstated-next";
import { SOLE_NETWORK } from "../../contexts/wallet";
import { environments } from "./environments";
export const envs = {
    "mainnet-beta": ChainId.MainnetBeta,
    devnet: ChainId.Devnet,
    testnet: ChainId.Testnet,
};
const useEnvironmentInternal = () => {
    const network = SOLE_NETWORK ?? "mainnet-beta";
    useEffect(() => {
        Sentry.setContext("network", {
            network,
        });
    }, [network]);
    const environment = environments[network];
    const chainId = useMemo(() => networkToChainId(network), [network]);
    return {
        loading: false,
        name: environment.name,
        endpoint: environment.endpoint,
        chainId,
        environments,
        network,
    };
};
export const { Provider: EnvironmentProvider, useContainer: useEnvironment } = createContainer(useEnvironmentInternal);
