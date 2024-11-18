import { useSail } from "@rockooor/sail";
import { VenkoSDK } from "@venkoapp/venko";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { useSDK } from "../../../../../contexts/sdk";
import { useWrapTx } from "@/hooks/useWrapTx";
import { useEnvironment } from "@/utils/useEnvironment";
import { useModal } from "../../../../../common/Modal/context";
import { ModalInner } from "../../../../../common/Modal/ModalInner";
import { ExternalLink } from "../../../../../common/typography/ExternalLink";
export const BulkStreamModalInner = ({ config }) => {
    const { sdkMut } = useSDK();
    const { handleTXs } = useSail();
    const { wrapTx } = useWrapTx();
    const { close } = useModal();
    const [txEnvs, setTXEnvs] = useState(null);
    useEffect(() => {
        if (!sdkMut) {
            return;
        }
        void (async () => {
            const { venko } = VenkoSDK.load({ provider: sdkMut.provider });
            const createTXs = await Promise.all(config.recipients.map(async (recipient) => {
                const { tx: createTX } = await venko.createStream({
                    amount: recipient.amount,
                    startTS: Math.floor(config.start.getTime() / 1_000),
                    endTS: Math.floor(config.end.getTime() / 1_000),
                    revoker: config.revocable
                        ? sdkMut.provider.wallet.publicKey
                        : undefined,
                    recipient: recipient.address,
                });
                return createTX;
            }));
            setTXEnvs(createTXs);
        })();
    }, [config, sdkMut]);
    const create = async () => {
        invariant(txEnvs);
        const { pending, success } = await handleTXs(await wrapTx(txEnvs), "Create Streams");
        if (!success || !pending) {
            return;
        }
        await Promise.all(pending.map((p) => p.wait()));
        close();
    };
    const { network } = useEnvironment();
    return (React.createElement(ModalInner, { title: "Bulk Stream Issuance", buttonProps: {
            onClick: create,
            variant: "primary",
            children: "Issue Streams",
        } },
        React.createElement("div", null, "You are about to send the following transactions:"),
        React.createElement("div", { tw: "flex flex-col text-sm" }, txEnvs?.map((tx, i) => (React.createElement("div", { key: i, tw: "flex justify-between py-4 border-b" },
            React.createElement("div", null,
                React.createElement("span", null,
                    "TX #",
                    i + 1)),
            React.createElement("div", null, network !== "localnet" && (React.createElement(ExternalLink, { href: tx.generateInspectLink(network) })))))))));
};
