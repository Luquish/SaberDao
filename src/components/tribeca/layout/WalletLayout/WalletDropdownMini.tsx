import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import React from "react";

import { useEnvironment } from "../../../../utils/tribeca/useEnvironment";
import { shortenAddress } from "../../../../utils/tribeca/utils";
import { Drop } from "../../common/Drop";
import { WalletButton } from "../GovernorLayout/Header/WalletButton";
import { AccountPopover } from "../MainLayout/Header/WalletDropdown/AccountPopover";

export const WalletDropdownMini: React.FC = () => {
  const { network } = useEnvironment();
  const wallet = useAnchorWallet();
  const { wallet: solanaWallet } = useWallet();

  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
  const [showAccountPopover, setShowAccountPopover] = useState<boolean>(false);

  return (
    <>
      {wallet ? (
        <>
          <button
            className="px-5 py-3 w-full flex items-center justify-between border rounded hover:bg-gray-50"
            ref={setTargetRef}
            onClick={() => {
              setShowAccountPopover((p) => !p);
            }}
          >
            <div className="text-left grid gap-0.5 text-sm">
              <span className="font-semibold">
                {shortenAddress(wallet.publicKey.toString())}
              </span>
              <span className="text-secondary">{startCase(network)}</span>
            </div>
            <div>
              {solanaWallet && (
                <>
                  {typeof solanaWallet.adapter.icon === "string" && (
                    <img
                      className="h-4 w-4"
                      src={solanaWallet.adapter.icon}
                      alt={`Icon for wallet ${solanaWallet.adapter.name}`}
                    />
                  )}
                </>
              )}
            </div>
          </button>
          <Drop
            onDismiss={() => setShowAccountPopover(false)}
            target={targetRef}
            show={showAccountPopover}
            placement={isMobile ? "top" : "top-start"}
          >
            <AccountPopover close={() => setShowAccountPopover(false)} />
          </Drop>
        </>
      ) : (
        <WalletButton />
      )}
    </>
  );
};
