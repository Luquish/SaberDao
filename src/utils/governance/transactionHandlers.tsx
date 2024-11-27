import type { UseSailArgs } from "@rockooor/sail";
import { notify } from "@/utils/governance/notifications";
import { ExternalLink } from "@/components/governance/common/typography/ExternalLink";

// Transaction handlers
export const onBeforeTxSend: UseSailArgs["onBeforeTxSend"] = ({
    network,
    txs,
    message,
  }) => {
        const cluster = network === "localnet" ? "devnet" : network;
        
        if (txs.length === 1) {
        notify({
            message: message
            ? `Requesting a signature for action: ${message}`
            : undefined,
            description: (
            <ExternalLink href={txs[0]?.generateInspectLink(cluster)}>
                View Preview
            </ExternalLink>
            ),
            env: network,
        });
        } else {
        notify({
            message: message
            ? `Requesting signatures for ${txs.length} transactions: ${message}`
            : undefined,
            description: (
            <>
                Preview:{" "}
                <div tw="inline-flex gap-2">
                {txs.map((tx, i) => (
                    <ExternalLink key={i} href={tx.generateInspectLink(cluster)}>
                    [{i + 1}]
                    </ExternalLink>
                ))}
                </div>
            </>
            ),
            env: network,
        });
        }
    };
  
export const onTxSend: UseSailArgs["onTxSend"] = ({ network, pending, message }) => {
notify({
    message,
    txids: pending.map(p => p.signature),
    env: network,
});
};

export const onSailError = (error: any) => {
notify({
    message: "Transaction failed",
    description: error.message,
    type: "error",
});
};