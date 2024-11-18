import { formatDistance } from "date-fns";
import React from "react";

import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { TXLink } from "@/components/tribeca/common/TXLink";
import { useTransaction } from "../context";
import { TXEvent } from "./TXEvent";

export const TXActivity: React.FC = () => {
  const { historicalTXs } = useTransaction();
  const txsWithEvents = historicalTXs?.flatMap((tx) =>
    tx.events.map((event) => ({ tx, event }))
  );
  return (
    <div>
      <h2 className="mt-8 text-gray-800 font-semibold mb-4">Activity</h2>
      {txsWithEvents ? (
        <div className="text-xs flex flex-col gap-4">
          {txsWithEvents.map(({ tx, event }, i) => {
            return (
              <div
                key={`${tx.sig}_${i}`}
                className="text-gray-500 inline-flex items-center gap-4"
              >
                <span>
                  <TXEvent event={event} />
                </span>
                <span>
                  {"timestamp" in event.data
                    ? formatDistance(
                        new Date(event.data.timestamp.toNumber() * 1_000),
                        new Date(),
                        { addSuffix: true }
                      )
                    : ""}
                </span>
                <TXLink
                  txSig={tx.sig}
                  className="text-primary hover:text-primary-300"
                >
                  {" "}
                </TXLink>
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};
