import { useQuarrySDK } from "@rockooor/react-quarry";
import { useSail } from "@rockooor/sail";
import { Saber, SABER_IOU_MINT, SBR_ADDRESS } from "@saberhq/saber-periphery";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AddressLink } from "@/common/AddressLink";
import { AsyncButton } from "@/common/AsyncButton";
import { Card } from "@/common/governance/Card";
export const InitializeRedeemer = ({ iouMint = SABER_IOU_MINT, }) => {
    const { sdkMut } = useQuarrySDK();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    return (React.createElement(Card, { title: "Initialize Redeemer", padded: true },
        React.createElement("p", null,
            "Redeemer does not yet exist for ",
            React.createElement(AddressLink, { address: iouMint }),
            "."),
        React.createElement(AsyncButton, { disabled: !sdkMut, onClick: async (sdkMut) => {
                const redeemerSDK = Saber.load({ provider: sdkMut.provider });
                const { tx } = await redeemerSDK.createRedeemer({
                    iouMint,
                    redemptionMint: SBR_ADDRESS,
                });
                await handleTX(await wrapTx(tx), "Create Redeemer");
            } }, "Initialize")));
};
