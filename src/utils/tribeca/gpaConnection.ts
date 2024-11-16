import type { Network } from "@saberhq/solana-contrib";
import { Connection } from "@solana/web3.js";

import { GENESYS_GO_RPC_ENDPOINT } from "./constants";

const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export const getGPAConnection = ({
  connection,
  network,
}: {
  connection?: Connection;
  network?: Network;
}): Connection => {
  if (!connection) {
    return new Connection(
      network === "devnet" ? DEVNET_ENDPOINT : GENESYS_GO_RPC_ENDPOINT
    );
  }
  return network === "mainnet-beta"
    ? new Connection(GENESYS_GO_RPC_ENDPOINT)
    : connection;
};
