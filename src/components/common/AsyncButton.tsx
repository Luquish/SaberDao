import type { GokiSDK } from "@gokiprotocol/client";
import React from "react";

import { useSDK } from "../../contexts/sdk";
import { WalletButton } from "../layout/GovernorLayout/Header/WalletButton";
import { Button } from "./Button";

interface Props
  extends Omit<React.ComponentPropsWithRef<typeof Button>, "onClick"> {
  onClick?: (sdkMut: GokiSDK) => Promise<void> | void;
  connectWalletOverride?: string;
}

export const AsyncButton: React.FC<Props> = ({
  onClick,
  children,
  ...rest
}: Props) => {
  const { sdkMut } = useSDK();
  return sdkMut !== null ? (
    <Button
      onClick={
        onClick
          ? async () => {
              await onClick(sdkMut);
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Button>
  ) : (
    <WalletButton />
  );
};
