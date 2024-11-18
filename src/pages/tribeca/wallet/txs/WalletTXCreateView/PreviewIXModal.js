import { useSail } from "@rockooor/sail";
import { SignerWallet, SingleConnectionBroadcaster, SolanaProvider, TransactionEnvelope, } from "@saberhq/solana-contrib";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { startCase } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import invariant from "tiny-invariant";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { AsyncButton } from "../../../../common/AsyncButton";
import { AttributeList } from "../../../../common/AttributeList";
import { Modal } from "../../../../common/Modal";
export const PreviewIXModal = ({ ix, txInstructions, formatted, isOpen, smartWallet, onDismiss, }) => {
    const { network } = useEnvironment();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    // TODO(michael): Figure this out ...
    const rpcURL = process.env.RPC_URL ?? "https://api.devnet.solana.com";
    const readonlyKeypair = Keypair.generate();
    const txEnv = useMemo(() => {
        const theTX = new Transaction();
        theTX.instructions = txInstructions;
        theTX.feePayer =
            smartWallet?.provider.wallet.publicKey ?? readonlyKeypair.publicKey;
        const readonlyConnection = new Connection(rpcURL);
        return new TransactionEnvelope(smartWallet?.provider ??
            new SolanaProvider(readonlyConnection, new SingleConnectionBroadcaster(readonlyConnection), new SignerWallet(readonlyKeypair)), txInstructions);
    }, [smartWallet, txInstructions, rpcURL, readonlyKeypair]);
    const [result, setResult] = useState(null);
    useEffect(() => {
        if (!txEnv) {
            return;
        }
        void (async () => {
            const theTX = txEnv.build();
            theTX.feePayer = txEnv.provider.wallet.publicKey;
            const simResult = await txEnv.provider.connection.simulateTransaction(theTX, undefined);
            setResult(simResult.value);
        })();
        return () => {
            setResult(null);
        };
    }, [txEnv]);
    return (React.createElement(Modal, { isOpen: isOpen, onDismiss: onDismiss },
        React.createElement("div", { tw: "flex flex-col gap-6" },
            React.createElement("h2", { tw: "font-semibold" },
                "Preview: ",
                startCase(ix.instruction.name)),
            formatted.args.length > 0 && (React.createElement("div", { tw: "grid gap-4" },
                React.createElement("h3", { tw: "font-semibold" }, "Arguments"),
                React.createElement(AttributeList, { attributes: formatted.args.reduce((acc, el) => ({
                        ...acc,
                        [`${el.name} (${el.type})`]: el.data,
                    }), {}) }))),
            React.createElement("div", { tw: "grid gap-4" },
                React.createElement("h3", { tw: "font-semibold" }, "Accounts"),
                React.createElement(AttributeList, { attributes: formatted.accounts.reduce((acc, el) => ({
                        ...acc,
                        [el.name ?? el.pubkey.toString()]: el.pubkey,
                    }), {}) })),
            React.createElement("div", null,
                React.createElement("h3", { tw: "font-semibold flex items-center gap-1" },
                    "Simulated Output",
                    result?.err && (React.createElement("span", { tw: "bg-red-500 px-1 py-0.5 rounded text-white text-xs" }, "error"))),
                React.createElement("div", { tw: "relative w-full max-w-full font-mono" },
                    React.createElement("div", { tw: "w-full max-w-full overflow-x-scroll text-xs whitespace-pre" }, result?.logs?.join("\n"))),
                network !== "localnet" && (React.createElement("a", { tw: "flex items-center text-primary gap-2", target: "_blank", href: txEnv?.generateInspectLink(network) ?? "", rel: "noreferrer" },
                    "View on Solana Explorer ",
                    React.createElement(FaExternalLinkAlt, null)))),
            React.createElement("div", null, smartWallet && (React.createElement(AsyncButton, { onClick: async () => {
                    invariant(smartWallet, "smart wallet");
                    const pendingTX = await smartWallet.newTransaction({
                        instructions: txInstructions,
                    });
                    await handleTX(await wrapTx(pendingTX.tx), `Propose ${startCase(ix.instruction.name)}`);
                    onDismiss();
                } }, "Propose Transaction"))))));
};
