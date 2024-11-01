import { useWallet } from "@solana/wallet-adapter-react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as React from "react";
import { FaChevronDown } from "react-icons/fa";

const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect Wallet",
  "no-wallet": (
    <div>
      Connect<span className="no-mobile"> Wallet</span>
    </div>
  ),
} as const;

export const WalletButton: React.FC = () => {
  const { publicKey } = useWallet();

  return (
    <div>
      <BaseWalletMultiButton
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        labels={LABELS}
      >
        {publicKey ? (
          <FaChevronDown className="text-black/80 dark:text-slate-200/80" />
        ) : null}
      </BaseWalletMultiButton>
    </div>
  );
};
