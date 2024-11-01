import { shortenAddress } from "@cardinal/namespaces";
import { useSail } from "@rockooor/sail";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { useCardinalDisplayName } from "../../../../hooks/cardinal/useAddressName";
import { ContentLoader } from "../../../common/ContentLoader";
import { Drop } from "../../../common/Drop";
import { AccountPopover } from "../../MainLayout/Header/WalletDropdown/AccountPopover";
import { WalletButton } from "./WalletButton";

interface Props {
  className?: string;
}

export const WalletDropdown: React.FC<Props> = ({ className }: Props) => {
  const wallet = useAnchorWallet();
  const { name, reverseEntryKey } = useCardinalDisplayName(wallet?.publicKey);
  const { wallet: solanaWallet } = useWallet();

  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
  const [showAccountPopover, setShowAccountPopover] = useState<boolean>(false);

  const { refetch } = useSail();
  useEffect(() => {
    if (reverseEntryKey) {
      void refetch(reverseEntryKey);
    }
    // handle is desired to be in here to enforce refresh of the name when modal closes
  }, [refetch, reverseEntryKey]);

  return (
    <>
      {wallet ? (
        <>
          <button
            className={className}
            tw="px-3 py-1 flex items-center gap-2 justify-between rounded border dark:(text-white border-none bg-warmGray-800 hover:bg-coolGray-800) z-20 md:z-auto"
            ref={setTargetRef}
            onClick={() => {
              setShowAccountPopover((p) => !p);
            }}
          >
            <div>
              {solanaWallet && (
                <>
                  {typeof solanaWallet.adapter.icon === "string" && (
                    <img
                      tw="h-4 w-4"
                      src={solanaWallet.adapter.icon}
                      alt={`Icon for wallet ${solanaWallet.adapter.name}`}
                    />
                  )}
                </>
              )}
            </div>
            <span tw="text-sm font-semibold">
              {name === undefined || !wallet ? (
                <ContentLoader />
              ) : name === null ? (
                shortenAddress(wallet.publicKey.toString())
              ) : (
                name
              )}
            </span>
          </button>
          <Drop
            onDismiss={() => setShowAccountPopover(false)}
            target={targetRef}
            show={showAccountPopover}
            placement="bottom-end"
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
