import { SolanaProvider, TransactionEnvelope } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { createContainer } from "unstated-next";
import { useProvider } from "../../../../../hooks/tribeca/useProvider";
import { useSignaturesForAddress } from "../../../../../hooks/tribeca/useSignaturesForAddress";
import { SMART_WALLET_CODER, useSmartWallet, } from "../../../../../hooks/tribeca/useSmartWallet";
import { useTransactions } from "../../../../../hooks/tribeca/useTransactions";
import { displayAddress } from "../../../../../utils/tribeca/programs";
import { shortenAddress } from "../../../../../utils/tribeca/utils";
const useTransactionInner = (tx) => {
    if (!tx) {
        throw new Error(`missing tx`);
    }
    const { smartWalletData } = useSmartWallet();
    const { provider, providerMut, network } = useProvider();
    const index = tx.tx.account.index.toNumber();
    const id = `TX-${index}`;
    const title = `${tx.instructions
        ?.map((ix) => (ix.parsed && "name" in ix.parsed
        ? `${ix.programName ?? displayAddress(ix.ix.programId.toString())}: ${ix.parsed.name.toString()}`
        : null) ??
        `Interact with ${ix.programName ?? shortenAddress(ix.ix.programId.toString())}`)
        .join(", ") ?? "Unknown Transaction"}`;
    const txData = tx.tx.account;
    const txEnv = useMemo(() => {
        if (tx.tx.account.instructions.length === 0) {
            return null;
        }
        return new TransactionEnvelope(providerMut ??
            SolanaProvider.load({
                connection: provider.connection,
                sendConnection: provider.connection,
                wallet: {
                    publicKey: network === "devnet"
                        ? new PublicKey("A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP")
                        : new PublicKey("9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg"),
                    signTransaction: () => {
                        throw new Error("unimplemented");
                    },
                    signAllTransactions: () => {
                        throw new Error("unimplemented");
                    },
                },
            }), tx.tx.account.instructions.map((ix) => ({
            ...ix,
            data: Buffer.from(ix.data),
        })));
    }, [network, provider.connection, providerMut, tx.tx.account.instructions]);
    const etaRaw = txData.eta.toNumber();
    const eta = etaRaw === -1 ? null : new Date(etaRaw * 1_000);
    const executedAtNum = tx.tx.account.executedAt.toNumber();
    const executedAt = executedAtNum === -1 ? null : new Date(executedAtNum * 1_000);
    const sigs = useSignaturesForAddress(tx.tx.publicKey);
    const historicalTXsRaw = useTransactions(sigs.data?.map((s) => s.signature) ?? []);
    const historicalTXs = useMemo(() => {
        return historicalTXsRaw
            .map(({ data: resp }) => {
            if (!resp) {
                return null;
            }
            const events = SMART_WALLET_CODER.parseProgramLogEvents(resp.tx.meta?.logMessages ?? []);
            return {
                ...resp.tx,
                events,
                sig: resp.sig,
                date: typeof resp.tx.blockTime === "number"
                    ? new Date(resp.tx.blockTime * 1_000)
                    : resp.tx.blockTime,
            };
        })
            .filter((t) => !!t);
    }, [historicalTXsRaw]);
    const numSigned = (tx?.tx.account.signers ?? []).filter((x) => !!x).length;
    const isOwnerSetValid = tx.tx.account.ownerSetSeqno === smartWalletData?.account.ownerSetSeqno;
    const threshold = smartWalletData
        ? smartWalletData.account?.threshold.toNumber()
        : null;
    const state = executedAt
        ? "executed"
        : !isOwnerSetValid
            ? "stale"
            : typeof threshold === "number" && numSigned >= threshold
                ? "approved"
                : "active";
    return {
        ...tx,
        id,
        index,
        title,
        historicalTXs,
        eta,
        executedAt,
        txEnv,
        state,
        numSigned,
    };
};
export const { useContainer: useTransaction, Provider: TransactionProvider } = createContainer(useTransactionInner);
