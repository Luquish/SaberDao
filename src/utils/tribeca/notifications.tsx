import type { Network } from "@saberhq/solana-contrib";
import React from "react";
import { toast } from "react-hot-toast";

interface INotifyArgs {
  message?: string;
  description?: React.ReactNode;
  txid?: string;
  txids?: string[];
  env?: Network;
  type?: "success" | "error" | "info" | "warn";
}

export function notify({
  message,
  description,
  txid,
  txids,
  env,
  type = "info",
}: INotifyArgs): void {
  // log for Sentry and other debug purposes
  const logLevel =
    type === "warn" ? "warn" : type === "error" ? "error" : "info";
  if (txids?.length === 1) {
    txid = txids[0];
  }
  console[logLevel](`Notify: ${message ?? "<no message>"}`, description, {
    env,
    txid,
    txids,
    type,
  });

  if (txid) {
    description = (
      <div>
        View Transaction:{" "}
        <a
          href={`https://explorer.solana.com/tx/${txid}?cluster=${
            env?.toString() ?? ""
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
        </a>
      </div>
    );
  } else if (txids) {
    description = (
      <div>
        View Transactions:{" "}
        <div className="inline-flex gap-1">
          {txids.map((txid, i) => (
            <a
              key={i}
              href={`https://explorer.solana.com/tx/${txid}?cluster=${
                env?.toString() ?? ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              [{i + 1}]
            </a>
          ))}
        </div>
      </div>
    );
  }

  toast(
    <div className="flex flex-col text-sm gap-1">
      <div className="font-medium">{message}</div>
      {description && <div className="text-secondary">{description}</div>}
    </div>
  );
}
