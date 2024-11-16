import { useToken, useUserATAs } from "@rockooor/sail";
import { navigate } from "@reach/router";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useSDK } from "@/contexts/sdk";
import {
  useLocker,
  useUserEscrow,
} from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Button } from "@/components/tribeca/common/Button";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Card } from "@/components/tribeca/common/governance/Card";
import { TokenAmountDisplay } from "@/components/tribeca/common/TokenAmountDisplay";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";
import { CardItem } from "./CardItem";
import { LockEscrowModal } from "./LockEscrowModal";

interface Props {
  className?: string;
}

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  const lockerSubpage = paths[paths.indexOf('locker') + 1] || '';
  return { lockerSubpage };
}

export const EscrowInfo: React.FC<Props> = ({ className }: Props) => {
  const location = useLocation();
  const { lockerSubpage } = getParams(location.pathname);
  const { governor, path } = useGovernor();
  const { data: locker } = useLocker();
  const { data: govToken } = useToken(locker?.account.tokenMint);
  const [govTokenBalance] = useUserATAs(govToken);
  const { data: escrow, isLoading, govTokensLocked } = useUserEscrow();
  const { sdkMut } = useSDK();

  const lockModalVariant =
    lockerSubpage === "lock" || lockerSubpage === "extend"
      ? lockerSubpage
      : null;
  const showModal = !!lockModalVariant;

  return (
    <Card className={className} title="Voting Wallet">
      <LockEscrowModal
        variant={lockModalVariant}
        escrowW={escrow ? escrow.escrowW : null}
        isOpen={showModal}
        onDismiss={() => navigate(`/tribeca/gov/${governor.toString()}/locker`)}
      />
      <CardItem label={`${govToken?.symbol ?? "Token"} Balance`}>
        <div className="flex items-center gap-2.5 h-7">
          {govTokenBalance ? (
            <TokenAmountDisplay
              amount={govTokenBalance.balance}
              showSymbol={false}
            />
          ) : (
            <div className="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
          )}
          <TokenIcon size={18} token={govToken} />
        </div>
      </CardItem>
      <CardItem label={`Your ${govToken?.symbol ?? "Token"} Locked`}>
        <div className="flex items-center gap-2.5 h-7">
          {govTokensLocked ? (
            <TokenAmountDisplay amount={govTokensLocked} showSymbol={false} />
          ) : (
            <ContentLoader className="h-4 w-12" />
          )}
          <TokenIcon size={18} token={govToken} />
        </div>
      </CardItem>
      <div className="px-7 py-4 flex gap-4">
        {!escrow && isLoading ? (
          <>
            <div className="w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" />
            <div className="w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" />
          </>
        ) : !sdkMut ? (
          <div className="w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" />
        ) : (
          <>
            <div className={escrow ? "w-1/2" : "w-full"}>
              <Link to={`/tribeca${path}/locker/lock`} className="flex-grow">
                <Button
                  className="w-full hover:dark:text-primary hover:dark:border-primary"
                  type="button"
                  size="md"
                  variant="outline"
                >
                  Lock
                </Button>
              </Link>
            </div>
            {escrow && (
              <div className="w-1/2">
                <Link to={`/tribeca${path}/locker/extend`} className="flex-grow">
                  <Button
                    className="w-full hover:dark:text-primary hover:dark:border-primary"
                    type="button"
                    size="md"
                    variant="outline"
                  >
                    Extend
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
