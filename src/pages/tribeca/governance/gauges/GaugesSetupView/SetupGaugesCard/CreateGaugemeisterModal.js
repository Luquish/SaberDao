import { GaugeSDK } from "@quarryprotocol/gauge";
import { useSail } from "@rockooor/sail";
import invariant from "tiny-invariant";
import { useSDK } from "@/contexts/sdk";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AttributeList } from "../../../../../common/AttributeList";
import { ModalInner } from "../../../../../common/Modal/ModalInner";
export const CreateGaugemeisterModal = ({ operator, rewarder, startTime, }) => {
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { lockerData } = useGovernor();
    const { sdkMut } = useSDK();
    const create = async () => {
        invariant(sdkMut && lockerData);
        const gauge = GaugeSDK.load({ provider: sdkMut.provider });
        const { gaugemeister, tx: createGMTX } = await gauge.gauge.createGaugemeister({
            firstEpochStartsAt: startTime,
            locker: lockerData.publicKey,
            operator: operator.accountId,
        });
        const { pending, success } = await handleTX(await wrapTx(createGMTX), `Create Gaugemeister at ${gaugemeister.toString()}`);
        if (!pending || !success) {
            return;
        }
        await pending.wait();
    };
    return (React.createElement(ModalInner, { title: "Create Gaugemeister", buttonProps: {
            onClick: create,
            variant: "primary",
            children: "Create Gaugemeister",
        } },
        React.createElement("div", { tw: "px-8 flex flex-col items-center" },
            React.createElement("p", { tw: "mb-4 text-sm" }, "Set up your gauge system."),
            React.createElement(AttributeList, { attributes: {
                    Rewarder: rewarder.accountId,
                    Operator: operator.accountId,
                    "Start Time": startTime.toLocaleString(undefined, {
                        timeZoneName: "short",
                    }),
                } }))));
};
