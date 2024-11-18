import { useSDK } from "@/contexts/sdk";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { Card } from "@/common/governance/Card";
import { LoadingPage } from "@/common/LoadingPage";
import { SetupVoting } from "./SetupVoting";
import { YourLockup } from "./YourLockup";
export const LockupDetails = ({ className }) => {
    const { sdkMut } = useSDK();
    const { data: userLockup, isLoading, isFetched, escrow } = useUserEscrow();
    if (isLoading || (sdkMut && escrow === undefined && !isFetched)) {
        return (React.createElement(Card, { className: className, title: "Your Lockup" },
            React.createElement("div", { tw: "py-6" },
                React.createElement(LoadingPage, null))));
    }
    if (!userLockup) {
        return React.createElement(SetupVoting, { className: className });
    }
    return React.createElement(YourLockup, { className: className });
};
