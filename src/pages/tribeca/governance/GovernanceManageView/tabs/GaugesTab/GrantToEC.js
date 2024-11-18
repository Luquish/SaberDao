import { GaugeSDK } from "@quarryprotocol/gauge";
import { useTXHandlers } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { FaSign } from "react-icons/fa";
import invariant from "tiny-invariant";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AddressLink } from "../../../../../common/AddressLink";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { CardWithImage } from "@/components/tribeca/common/governance/CardWithImage";
import { ProseSmall } from "../../../../../common/typography/Prose";
import { useGMData } from "../../../gauges/hooks/useGaugemeister";
export const GrantToEC = () => {
    const { data: gmData } = useGMData();
    const { ownerInvokerKey } = useExecutiveCouncil();
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    const foreman = mapSome(gmData, (d) => d.account.foreman);
    const foremanIsEC = !!(ownerInvokerKey && foreman?.equals(ownerInvokerKey));
    if (foremanIsEC) {
        return React.createElement(React.Fragment, null);
    }
    return (React.createElement(CardWithImage, { title: "Grant to Executive Council", image: React.createElement("div", { tw: "flex items-center justify-center h-full" },
            React.createElement(FaSign, { tw: "w-20 h-20" })) },
        React.createElement(ProseSmall, null,
            React.createElement("p", null, "The Gaugemeister's foreman is not currently set to the Executive Council."),
            foreman && (React.createElement("p", null,
                "It is currently set to ",
                React.createElement(AddressLink, { address: foreman, showCopy: true }),
                ".")),
            React.createElement(AsyncButton, { onClick: async (sdkMut) => {
                    invariant(gmData);
                    const { gauge } = GaugeSDK.load({ provider: sdkMut.provider });
                    const tx = await gauge.setGaugemeisterParams({
                        gaugemeister: gmData.publicKey,
                        newForeman: ownerInvokerKey,
                    });
                    await signAndConfirmTX(await wrapTx(tx), "Set foreman to EC");
                } }, "Set Gaugemeister Foreman to Executive Council"))));
};
