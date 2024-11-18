import { useSail, useTXHandlers } from "@rockooor/sail";
import { DEFAULT_LOCKER_PARAMS } from "@tribecahq/tribeca-sdk";
import invariant from "tiny-invariant";
import { useSDK } from "@/contexts/sdk";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/useWrapTx";
import { Alert } from "@/common/Alert";
import { AsyncButton } from "@/common/AsyncButton";
import { Card } from "@/common/governance/Card";
import { CardWithImage } from "@/common/governance/CardWithImage";
import { ExternalLink } from "@/common/typography/ExternalLink";
import { ProseSmall } from "@/common/typography/Prose";
import { createAndSyncSnapshots, syncSnapshots, useSnapshotHistories, } from "../LockerSnapshots/useSnapshotHistories";
import { ReactComponent as TimeTravel } from "./TimeTravel.svg";
export const LockerSnapshotsBasic = ({ owner }) => {
    const { tribecaMut } = useSDK();
    const { refetchMany } = useSail();
    const { wrapTx } = useWrapTx();
    const { eras, lockerKey, escrow, escrowKey, hasMissingHistories, estimatedCost, unsyncedSnapshots, } = useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey);
    const { lockerData } = useGovernor();
    const { signAndConfirmTXs } = useTXHandlers();
    // TODO(michael): Remove this condition when we're ready for launch.
    if (!owner ||
        escrow?.escrow.amount.gte(lockerData?.account.params.proposalActivationMinVotes ??
            DEFAULT_LOCKER_PARAMS.proposalActivationMinVotes)) {
        return React.createElement("div", null);
    }
    if (hasMissingHistories) {
        return (React.createElement(CardWithImage, { title: "Set up Snapshots", image: React.createElement("div", { tw: "flex items-center justify-center p-8" },
                React.createElement(TimeTravel, { tw: "w-3/4 h-3/4 text-primary" })) },
            React.createElement(ProseSmall, null,
                React.createElement("p", null, "Create snapshots of your vote escrow in order to earn rewards and participate in airdrops."),
                React.createElement(ExternalLink, { href: "https://docs.tribeca.so/features/snapshots" }, "Learn more about Snapshots"),
                React.createElement(AsyncButton, { tw: "mt-4", variant: "primary", disabled: !lockerKey || !escrowKey, onClick: async (sdkMut) => {
                        invariant(lockerKey && escrowKey);
                        const { createTXs, syncTXs } = await createAndSyncSnapshots({
                            provider: sdkMut.provider,
                            refetchMany,
                            locker: lockerKey,
                            escrow: escrowKey,
                            eras,
                        });
                        await signAndConfirmTXs(await wrapTx(createTXs.slice()), "Create Snapshots");
                        await signAndConfirmTXs(await wrapTx(syncTXs.slice()), "Sync Snapshots");
                    } },
                    "Setup (costs ~",
                    estimatedCost?.formatUnits(),
                    ")"))));
    }
    return (React.createElement(React.Fragment, null, escrow?.escrow.amount.gte(
    // TODO(michael): Remove this condition when we're ready for launch.
    lockerData?.account.params.proposalActivationMinVotes ??
        DEFAULT_LOCKER_PARAMS.proposalActivationMinVotes) && (React.createElement(Card, { title: "Snapshots", padded: true }, unsyncedSnapshots && unsyncedSnapshots.length > 0 ? (React.createElement("div", null,
        React.createElement(Alert, null,
            React.createElement(ProseSmall, null,
                React.createElement("h2", null, "Your snapshots are out of sync"),
                React.createElement("p", null, "Your balance snapshots are out of sync. You could be missing out on reward distributions or airdrops."),
                React.createElement(ExternalLink, { href: "https://docs.tribeca.so/features/snapshots" }, "Learn more about Snapshots"),
                React.createElement(AsyncButton, { tw: "mt-4", variant: "primary", onClick: async (sdkMut) => {
                        invariant(lockerKey && escrowKey);
                        const syncTXs = await syncSnapshots({
                            provider: sdkMut.provider,
                            locker: lockerKey,
                            escrow: escrowKey,
                            eras: unsyncedSnapshots,
                        });
                        await signAndConfirmTXs(await wrapTx(syncTXs), "Sync Snapshots");
                    } },
                    "Sync Snapshots (",
                    unsyncedSnapshots.length,
                    " TXs)"))))) : (React.createElement("div", { tw: "text-center" }, "Your balance snapshots are up to date. \uD83D\uDC4D"))))));
};
