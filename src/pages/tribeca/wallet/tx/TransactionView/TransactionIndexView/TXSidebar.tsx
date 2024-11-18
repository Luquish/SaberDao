import copyToClipboard from "copy-to-clipboard";
import { startCase } from "lodash-es";
import { FaCheckCircle, FaLink, FaQuestionCircle } from "react-icons/fa";
import React from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { notify } from "@/utils/notifications";
import { NamedAddressLink } from "@/components/tribeca/common/account/NamedAddressLink";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { useTransaction } from "../context";

export const TXSidebar: React.FC = () => {
  const { smartWalletData } = useSmartWallet();
  const { tx, id, executedAt, eta, state } = useTransaction();
  return (
    <>
      <div className="text-xs border-b pb-2">
        <div className="flex">
          <span className="font-semibold text-secondary w-[90px]">
            {id}
          </span>
          <div className="text-secondary">
            <FaLink
              onClick={() => {
                copyToClipboard(window.location.href);
                notify({
                  message: "Transaction link copied to clipboard.",
                  description: "Paste it wherever you like.",
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-xs mt-4">
        <div className="flex mb-4">
          <span className="text-secondary w-[90px]">Key</span>
          <span>
            <AddressLink address={tx.publicKey} showCopy />
          </span>
        </div>
        <div className="flex mb-4">
          <span className="text-secondary w-[90px]">State</span>
          <span>{startCase(state)}</span>
        </div>
        <div className="flex mb-4">
          <span className="text-secondary w-[90px]">ETA</span>
          <span>
            {eta?.toLocaleString(undefined, {
              timeZoneName: "short",
            }) ?? "--"}
          </span>
        </div>
        <div className="flex mb-4">
          <span className="text-secondary w-[90px]">Signers</span>
          <div className="grid gap-1">
            {(tx.account.signers as boolean[]).map((signer, i) => {
              const currSigner = smartWalletData?.account?.owners?.[i];
              if (currSigner) {
                return (
                  <div className="flex items-center gap-2" key={i}>
                    <NamedAddressLink address={currSigner} />
                    {signer ? (
                      <FaCheckCircle className="text-primary" />
                    ) : (
                      <FaQuestionCircle className="text-gray-500" />
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className="flex mb-4">
          <span className="text-secondary w-[90px]">Proposer</span>
          <span>
            <NamedAddressLink address={tx.account.proposer} showCopy />
          </span>
        </div>
        <div className="flex mb-4">
          <span className="text-secondary w-[90px] flex-shrink-0">
            Executed At
          </span>
          <span className="flex-shrink">
            {executedAt?.toLocaleString(undefined, {
              timeZoneName: "short",
            }) ?? "--"}
          </span>
        </div>
        {executedAt && (
          <div className="flex mb-4">
            <span className="text-secondary w-[90px]">Executor</span>
            <span>
              <NamedAddressLink address={tx.account.executor} showCopy />
            </span>
          </div>
        )}
      </div>
    </>
  );
};
