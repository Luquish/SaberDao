import { findTransactionAddress, GOKI_ADDRESSES, SmartWalletJSON, } from "@gokiprotocol/client";
import { SuperCoder } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import { startCase, uniq } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { useSDK } from "../../contexts/sdk";
import { InstructionParseError, parseNonAnchorInstruction, } from "../../utils/tribeca/instructions/parseNonAnchorInstruction";
import { useBatchedGokiTransactions, useGokiSmartWalletData, } from "../../utils/tribeca/parsers";
import { displayAddress, programLabel } from "../../utils/tribeca/programs";
import { useIDLs } from "./useIDLs";
export const SMART_WALLET_CODER = new SuperCoder(GOKI_ADDRESSES.SmartWallet, SmartWalletJSON);
const useSmartWalletInner = (key) => {
    if (!key) {
        throw new Error("missing key");
    }
    const { sdkMut } = useSDK();
    const { data: smartWalletData } = useGokiSmartWalletData(key);
    const [smartWallet, setSmartWallet] = useState(null);
    const [txAddrs, setTxAddrs] = useState([]);
    const { data: txs } = useBatchedGokiTransactions(txAddrs);
    useEffect(() => {
        if (!smartWalletData) {
            setTxAddrs([]);
            return;
        }
        void (async () => {
            const numTransactions = smartWalletData.account.numTransactions.toNumber();
            if (numTransactions) {
                const txAddrs = await Promise.all(Array(numTransactions)
                    .fill(null)
                    .map(async (_, i) => {
                    const [key] = await findTransactionAddress(smartWalletData.publicKey, i);
                    return key;
                }));
                setTxAddrs(txAddrs);
            }
        })();
    }, [key, smartWalletData]);
    useEffect(() => {
        if (!sdkMut) {
            setSmartWallet(null);
            return;
        }
        void (async () => {
            const sw = await sdkMut.loadSmartWallet(key);
            setSmartWallet(sw);
        })();
    }, [key, sdkMut]);
    const programIDsToFetch = useMemo(() => uniq(txs
        ?.flatMap((tx) => tx?.account.instructions.map((ix) => ix.programId.toString()))
        .filter((x) => !!x)), [txs]);
    const idls = useIDLs(programIDsToFetch.map((p) => new PublicKey(p)));
    const parsedTXs = useMemo(() => {
        return txs
            ?.filter((tx) => !!tx)
            .map((tx) => {
            const index = tx.account.index.toNumber();
            const instructions = tx.account.instructions
                .map((rawIx) => ({
                ...rawIx,
                data: Buffer.from(rawIx.data),
            }))
                .map((ix) => {
                const idlIndex = programIDsToFetch.findIndex((pid) => pid === ix.programId.toString());
                const idl = idls[idlIndex]?.data?.idl;
                const label = programLabel(ix.programId.toString());
                if (idl) {
                    const superCoder = new SuperCoder(ix.programId, {
                        ...idl,
                        instructions: idl.instructions.concat(idl.state?.methods ?? []),
                    });
                    const common = {
                        programName: label ?? startCase(idl.name),
                        ix,
                    };
                    try {
                        const ixParsed = superCoder.parseInstruction(ix);
                        return {
                            ...common,
                            parsed: {
                                ...ixParsed,
                                anchor: true,
                            },
                        };
                    }
                    catch (e) {
                        return {
                            ...common,
                            parsed: { error: new InstructionParseError(ix, e) },
                        };
                    }
                }
                const parsedNonAnchor = parseNonAnchorInstruction(ix);
                return { ix, programName: label, parsed: parsedNonAnchor };
            })
                .map((ix) => ({
                ...ix,
                title: `${ix.programName ?? displayAddress(ix.ix.programId.toString())}: ${startCase((ix.parsed && "name" in ix.parsed ? ix.parsed.name : null) ??
                    "Unknown Instruction")}`,
            }));
            return { tx, index, instructions };
        })
            .sort((a, b) => {
            const aIndex = a.index;
            const bIndex = b.index;
            if (aIndex !== undefined && bIndex !== undefined) {
                return aIndex < bIndex ? 1 : -1;
            }
            if (aIndex !== undefined && bIndex === undefined) {
                return -1;
            }
            return 1;
        });
    }, [idls, programIDsToFetch, txs]);
    const threshold = smartWalletData?.account.threshold.toNumber();
    const path = `/wallets/${key.toString()}`;
    return { key, smartWallet, smartWalletData, parsedTXs, threshold, path };
};
export const { useContainer: useSmartWallet, Provider: SmartWalletProvider } = createContainer(useSmartWalletInner);
