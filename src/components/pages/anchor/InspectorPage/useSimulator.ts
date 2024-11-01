import { utils } from "@project-serum/anchor";
import type { InstructionLogs, Network } from "@saberhq/solana-contrib";
import { parseTransactionLogs } from "@saberhq/solana-contrib";
import type { Message, SimulatedTransactionResponse } from "@solana/web3.js";
import { Connection, Transaction } from "@solana/web3.js";
import React, { useState } from "react";

import { GENESYS_GO_RPC_ENDPOINT } from "../../../../utils/constants";
import { useEnvironment } from "../../../../utils/useEnvironment";

const DEFAULT_SIGNATURE = utils.bytes.bs58.encode(Buffer.alloc(64).fill(0));

const networkURLs: { [N in Network]: string } = {
  "mainnet-beta": GENESYS_GO_RPC_ENDPOINT,
  devnet: "https://api.devnet.solana.com/",
  testnet: "https://api.testnet.solana.com/",
  localnet: "http://localhost:8899/",
};

export const useSimulator = (message: Message) => {
  const { network } = useEnvironment();

  const [simulating, setSimulating] = React.useState(false);
  const [logs, setLogs] = React.useState<Array<InstructionLogs> | null>(null);
  const [response, setResponse] = useState<SimulatedTransactionResponse | null>(
    null
  );
  const [error, setError] = React.useState<string>();

  const url = networkURLs[network];

  React.useEffect(() => {
    setLogs(null);
    setSimulating(false);
    setError(undefined);
  }, [network]);

  const onClick = React.useCallback(() => {
    if (simulating) return;
    setError(undefined);
    setSimulating(true);

    const connection = new Connection(url, "confirmed");
    void (async () => {
      try {
        const tx = Transaction.populate(
          message,
          new Array(message.header.numRequiredSignatures).fill(
            DEFAULT_SIGNATURE
          )
        );

        // Simulate without signers to skip signer verification
        const resp = await connection
          .simulateTransaction(tx, undefined, true)
          .catch(() => {
            return connection.simulateTransaction(tx, undefined);
          });

        // Prettify logs
        setLogs(parseTransactionLogs(resp.value.logs, resp.value.err));
        setResponse(resp.value);
      } catch (err) {
        console.error(err);
        setLogs(null);
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setSimulating(false);
      }
    })();
  }, [url, message, simulating]);
  return {
    simulate: onClick,
    simulating,
    simulationLogs: logs,
    simulationError: error,
    response,
  };
};
