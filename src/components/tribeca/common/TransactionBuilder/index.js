import { AnchorProvider, Program } from "@project-serum/anchor";
import { SignerWallet } from "@saberhq/solana-contrib";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useProgramIndex } from "../../../../hooks/tribeca/deploydao/useProgramIndex";
import { useIDL } from "../../../../hooks/tribeca/useIDLs";
import { IXForm } from "../../../../pages/tribeca/wallet/txs/WalletTXCreateView/IXForm";
import { Select } from "../inputs/InputText";
import React from "react";
export const TransactionBuilder = () => {
    const { connection } = useConnection();
    const [programID, setProgramID] = useState(null);
    const [ix, setIx] = useState(null);
    const { data: index } = useProgramIndex();
    const { data: idlData } = useIDL(programID);
    const idl = idlData?.idl;
    const ixs = useMemo(() => {
        if (!idl) {
            return idl;
        }
        const methods = (idl?.state?.methods ?? []).map((ix) => ({
            type: "method",
            instruction: ix,
        }));
        const instructions = (idl?.instructions ?? []).map((ix) => ({
            type: "instruction",
            instruction: ix,
        }));
        return [...methods, ...instructions];
    }, [idl]);
    const program = useMemo(() => {
        if (idl && programID) {
            const provider = new AnchorProvider(connection, new SignerWallet(Keypair.generate()), AnchorProvider.defaultOptions());
            return new Program(idl, programID, provider);
        }
        return null;
    }, [connection, idl, programID]);
    useEffect(() => {
        setIx(ixs?.[0] ?? null);
    }, [ixs]);
    return (React.createElement("form", { className: "grid gap-4" },
        React.createElement("div", { className: "p-4 border grid gap-4" },
            React.createElement("label", { className: "grid gap-1" },
                React.createElement("span", null, "Program"),
                React.createElement(Select, { onChange: (e) => {
                        setProgramID(e.target.value ? new PublicKey(e.target.value) : null);
                    } },
                    React.createElement("option", { key: "", value: "" }, index ? "Select a program" : "Loading..."),
                    index
                        ? index.map(({ label, address }) => {
                            return (React.createElement("option", { key: address.toString(), value: address.toString() }, `${label} (${address.toString()})`));
                        })
                        : null)),
            programID && (React.createElement("label", { className: "grid gap-1" },
                React.createElement("span", null, "Instruction"),
                React.createElement(Select, { onChange: (e) => {
                        const [ixType, ixName] = e.target.value.split("_");
                        const theIX = ixs?.find((ix) => ix.type === ixType && ix.instruction.name === ixName);
                        setIx(theIX ?? null);
                    } }, ixs
                    ? ixs.map((ix) => {
                        return (React.createElement("option", { key: `${ix.type}_${ix.instruction.name}`, value: `${ix.type}_${ix.instruction.name}` },
                            ix.type === "method" ? `${idl?.name ?? ""}#` : "",
                            ix.instruction.name));
                    })
                    : null)))),
        ix && program && (React.createElement("div", { className: "p-4 border" },
            React.createElement(IXForm, { key: `${program.programId.toString()}_${ix.type}_${ix.instruction.name}`, types: idl?.types, ix: ix, program: program })))));
};
