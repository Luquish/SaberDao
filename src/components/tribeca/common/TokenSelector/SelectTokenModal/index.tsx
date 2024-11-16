import { useUserATAs } from "@rockooor/sail";
import type { Token } from "@saberhq/token-utils";
import { RAW_SOL_MINT } from "@saberhq/token-utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useSDK } from "../../../../../contexts/sdk";
import { LoadingSpinner } from "../../LoadingSpinner";
import type { ModalProps } from "../../Modal";
import { Modal } from "../../Modal";
import { TokenIcon } from "../../TokenIcon";
import { ReactComponent as SolanaLogo } from "./solana.svg";
import { ReactComponent as Solscan } from "./solscan.svg";
import { ReactComponent as SolscanGray } from "./solscan-gray.svg";

interface Props extends Omit<ModalProps, "children"> {
  tokens: readonly Token[];
  onSelect: (token: Token) => void;
}

export const SelectTokenModal: React.FC<Props> = ({
  onSelect,
  tokens,
  ...modalProps
}: Props) => {
  const wallet = useAnchorWallet();
  const { nativeBalance } = useSDK();
  const balances = useUserATAs(...tokens);
  return (
    <Modal {...modalProps} className="p-0">
      <div className="grid gap-3 py-3">
        <div className="h-6 flex items-center justify-center">
          <SolanaLogo />
        </div>
        <div className="mt-10 px-7">
          <h2 className="font-bold text-xl">Select a token</h2>
        </div>
        <div>
          {tokens.map((token) => {
            const userBalance = balances.find((b) =>
              b?.balance?.token?.equals(token)
            );
            const balance = token.mintAccount.equals(RAW_SOL_MINT)
              ? nativeBalance
              : userBalance?.balance;
            return (
              // TODO: make this accessible
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                role="button"
                tabIndex={0}
                key={token.address}
                className="cursor-pointer hover:bg-gray-100 h-16 flex items-center px-7"
                onClick={() => {
                  onSelect(token);
                }}
              >
                <div className="flex items-center h-full w-full justify-between border-b">
                  <div className="flex gap-3 items-center w-full h-full">
                    <TokenIcon size={20} token={token} />
                    <div className="flex flex-col flex-shrink-[1]">
                      <span className="text-sm font-medium">{token.name}</span>
                      {wallet && (
                        <span className="text-xs text-secondary">
                          {userBalance === undefined ? (
                            <LoadingSpinner />
                          ) : (
                            balance?.formatUnits() ?? `0 ${token.symbol}`
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    className="group"
                    href={`https://solscan.io/address/${token.address}`}
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    rel="noreferrer"
                  >
                    <Solscan className="hidden group-hover:block" />
                    <SolscanGray className="group-hover:hidden" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
