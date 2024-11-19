import { useSail } from "@rockooor/sail";
import { formatDistance } from "date-fns";
import React from "react";

import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { Button } from "@/components/tribeca/common/Button";
import Card from "@/components/tribeca/common/governance/Card";
import LoadingSpinner from "@/components/tribeca/common/LoadingSpinner";
import { TokenAmountDisplay } from "@/components/tribeca/common/TokenAmountDisplay";
import { makeDate } from "@/pages/tribeca/proposals/ProposalIndexView/locked-voter/ProposalHistory";
import CardItem from "@/pages/tribeca/locker/LockerIndexView/locked-voter/CardItem";

interface Props {
  className?: string;
}

const YourLockup: React.FC<Props> = ({ className }: Props) => {
  const { veToken } = useGovernor();
  const { data: escrow, veBalance } = useUserEscrow();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  if (!escrow) {
    return <></>;
  }

  const endDate = makeDate(escrow.escrow.escrowEndsAt);

  if (endDate <= new Date()) {
    return (
      <Card title="Your Lockup" className={className}>
        <div className="px-7 py-4 text-sm grid gap-4">
          <p>
            Your lockup has expired. You may now withdraw your locked tokens.
          </p>
          <div>
            <Button
              size="md"
              variant="primary"
              onClick={async () => {
                const exitTX = await escrow.escrowW.exit();
                const { pending, success } = await handleTX(
                  await wrapTx(exitTX),
                  "Exit Vote Escrow"
                );
                if (!success || !pending) {
                  return;
                }
                await pending.wait();
              }}
            >
              Withdraw Tokens
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const timeRemaining = formatDistance(endDate, new Date());

  return (
    <Card title="Your Lockup" className={className}>
      <div className="flex flex-row flex-wrap">
        <CardItem label={`${veToken?.symbol ?? "ve"} Balance`}>
          {veBalance ? (
            <TokenAmountDisplay amount={veBalance} showSymbol={false} />
          ) : (
            <LoadingSpinner />
          )}
        </CardItem>
        <CardItem label="Time Remaining">{timeRemaining}</CardItem>
        <CardItem label="End Date">{endDate.toLocaleDateString()}</CardItem>
      </div>
    </Card>
  );
};

export default YourLockup;