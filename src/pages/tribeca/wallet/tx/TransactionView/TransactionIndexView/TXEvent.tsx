import React from "react";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import type { SmartWalletEvent } from "@/contexts/tribeca/transaction";

interface Props {
  event: SmartWalletEvent;
}

const TXEvent: React.FC<Props> = ({ event }: Props) => {
  switch (event.name) {
    case "TransactionCreateEvent":
      return (
        <>
          <AddressLink
            className="text-gray-800 font-medium"
            address={event.data.proposer}
          />{" "}
          <span>proposed the transaction.</span>
        </>
      );
    case "TransactionApproveEvent":
      return (
        <>
          <AddressLink
            className="text-gray-800 font-medium"
            address={event.data.owner}
          />{" "}
          <span>approved the transaction.</span>
        </>
      );
    case "TransactionExecuteEvent":
      return (
        <>
          <AddressLink
            className="text-gray-800 font-medium"
            address={event.data.executor}
          />{" "}
          <span>executed the transaction.</span>
        </>
      );
    case "WalletSetOwnersEvent":
      return (
        <>
          <span>The owners of the wallet were changed to</span>{" "}
          {event.data.owners.map((owner, i) => (
            <>
              {i !== 0 && <span>, </span>}
              <AddressLink
                key={i}
                className="text-gray-800 font-medium"
                address={owner}
              />
            </>
          ))}
          .
        </>
      );
    default:
      return <>unknown</>;
  }
};

export default TXEvent;
