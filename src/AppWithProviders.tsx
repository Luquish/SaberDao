import { ThemeProvider } from "@emotion/react";
import { GOKI_ADDRESSES, SmartWalletJSON } from "@gokiprotocol/client";
import { QUARRY_IDLS } from "@quarryprotocol/quarry-sdk";
import type {
  SailError,
  SailGetMultipleAccountsError,
  SailTransactionError,
  UseSailArgs,
} from "@rockooor/sail";
import { SailProvider } from "@rockooor/sail";
import * as Sentry from "@sentry/react";
import type { PublicKey } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { mapValues } from "lodash-es";
import React from "react";

import { App } from "./App";
import { ExternalLink } from "./components/common/typography/ExternalLink";
import { QuarryInterfaceProvider } from "./contexts/quarry";
import type { ProgramKey } from "./contexts/sdk";
import { SDKProvider } from "./contexts/sdk";
import { WalletConnectorProvider } from "./contexts/wallet";
import { theme } from "./theme";
import { describeRPCError, handleException } from "./utils/error";
import { notify } from "./utils/notifications";
import { parseIdlErrors, ProgramError } from "./utils/programError";

const programErrors = mapValues(
  {
    SmartWallet: SmartWalletJSON,
    ...QUARRY_IDLS,
  },
  (prog) => parseIdlErrors(prog)
);

const programIDs = Object.entries({
  ...GOKI_ADDRESSES,
}).reduce(
  (acc, [name, prog]: [name: string, prog: PublicKey]) => ({
    ...acc,
    [prog.toString()]: name,
  }),
  {}
) as Record<string, ProgramKey>;

const onBeforeTxSend: UseSailArgs["onBeforeTxSend"] = ({
  network,
  txs,
  message,
}) => {
  const cluster = network === "localnet" ? "devnet" : network;
  console.info(`Requesting signatures for the following transactions:`);
  console.table(
    txs.map((tx) => ({
      inspect: tx.generateInspectLink(cluster),
    }))
  );
  if (txs.length === 1) {
    notify({
      message: message
        ? `Requesting a signature for action: ${message}`
        : undefined,
      description: (
        <ExternalLink href={txs[0]?.generateInspectLink(cluster)}>
          View Preview
        </ExternalLink>
      ),
      env: network,
    });
  } else {
    notify({
      message: message
        ? `Requesting signatures for ${txs.length} transactions: ${message}`
        : undefined,
      description: (
        <>
          Preview:{" "}
          <div tw="inline-flex gap-2">
            {txs.map((tx, i) => (
              <ExternalLink key={i} href={tx.generateInspectLink(cluster)}>
                [{i + 1}]
              </ExternalLink>
            ))}
          </div>
        </>
      ),
      env: network,
    });
  }
};

const onTxSend: UseSailArgs["onTxSend"] = ({ network, pending, message }) => {
  notify({
    message,
    txids: pending.map((p) => p.signature),
    env: network,
  });
  pending.forEach((p, i) => {
    console.log(
      `View Transaction #${i + 1} of ${pending.length}:`,
      `https://explorer.solana.com/tx/${p.signature}?cluster=${network}`
    );
  });
};

const onTxError = (error: SailTransactionError) => {
  // Log the program error
  const err = error.originalError as Error;
  const { tx } = error;
  if (err.toString().includes(": custom program error:")) {
    // todo: figure out the duplicates
    if (error.network !== "localnet") {
      console.error(`TX`, tx.generateInspectLink(error.network));
    }
    const progError = ProgramError.parse(err, tx, programIDs, programErrors);
    if (progError) {
      const message = err.message.split(":")[1] ?? "Transaction failed";
      notify({
        message,
        description: `${progError.message}`,
        env: error.network,
        type: "error",
      });
      const sentryArgs = {
        tags: {
          program: progError.program ?? "AnchorInternal",
          "program.error.code": progError.code,
          "program.error.name": progError.errorName,
        },
        extra: {
          progError,
          message,
          originalError: err,
        },
      } as const;
      console.error(progError, sentryArgs);
      Sentry.captureException(progError, sentryArgs);
      return;
    }
  }

  if (/(.+)?: custom program error: 0x1$/.exec(err.message.toString())) {
    notify({
      message: `Insufficient SOL (need more SOL)`,
      description: error.message,
      env: error.network,
      type: "warn",
    });
    return;
  } else if (err.message.includes("Signature request denied")) {
    notify({
      message: `Transaction cancelled`,
      description: error.message,
      env: error.network,
      type: "info",
    });
    return;
  } else {
    notify({
      message: `Transaction failed (try again later)`,
      description: error.message,
      env: error.network,
      type: "error",
    });
    const { tx } = error;
    if (error.network !== "localnet") {
      console.error(`TX`, tx.generateInspectLink(error.network));
    }
  }
  const sentryArgs = {
    tags: {
      "tx.error": error.tag,
    },
    fingerprint: error.fingerprint,
  } as const;
  console.error(error, sentryArgs);
  Sentry.captureException(error, sentryArgs);
};

const onGetMultipleAccountsError = (
  err: SailGetMultipleAccountsError
): void => {
  handleException(err, {
    source: "onGetMultipleAccountsError",
    userMessage: {
      title: "Error fetching data from Solana",
      description: describeRPCError((err.originalError as Error).message),
    },
    extra: {
      accounts: err.keys.map((k) => k.toString()),
    },
  });
  return;
};

const onSailError = (err: SailError) => {
  switch (err.sailErrorName) {
    case "SailTransactionError": {
      onTxError(err as SailTransactionError);
      return;
    }
    case "SailGetMultipleAccountsError": {
      onGetMultipleAccountsError(err as SailGetMultipleAccountsError);
      return;
    }
    case "SailTransactionSignError": {
      notify({
        message: "Failed to sign transaction",
        description: err.cause,
      });
      return;
    }
    case "SailAccountParseError": {
      // don't log account parsing errors
      console.debug("SailAccountParseError", err);
      return;
    }
  }
  handleException(err, {
    source: "sail.unknown",
    userMessage: {
      title: err.title,
      description: err.message,
    },
  });
};

const queryClient = new QueryClient();

export const AppWithProviders: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <WalletConnectorProvider>
            <SailProvider
              initialState={{
                batchDurationMs: 50,
                onBeforeTxSend,
                onTxSend,
                onSailError,
              }}
            >
              <QuarryInterfaceProvider>
                <SDKProvider>
                  <App />
                </SDKProvider>
              </QuarryInterfaceProvider>
            </SailProvider>
          </WalletConnectorProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
