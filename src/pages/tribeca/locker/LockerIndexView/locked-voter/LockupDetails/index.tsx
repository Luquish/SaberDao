import { useSDK } from "@/contexts/sdk";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import Card from "@/components/tribeca/common/governance/Card";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import SetupVoting from "./SetupVoting";
import YourLockup from "./YourLockup";
import React from "react";

interface Props {
  className?: string;
}

const LockupDetails: React.FC<Props> = ({ className }: Props) => {
  const { sdkMut } = useSDK();
  const { data: userLockup, isLoading, isFetched, escrow } = useUserEscrow();

  if (isLoading || (sdkMut && escrow === undefined && !isFetched)) {
    return (
      <Card className={className} title="Your Lockup">
        <div className="py-6">
          <LoadingPage />
        </div>
      </Card>
    );
  }

  if (!userLockup) {
    return <SetupVoting className={className} />;
  }

  return <YourLockup className={className} />;
};

export default LockupDetails;
