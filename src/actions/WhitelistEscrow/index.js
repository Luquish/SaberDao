import { usePubkey } from "@rockooor/sail";
import { buildStubbedTransaction } from "@saberhq/solana-contrib";
import { SystemProgram } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { findWhitelistAddress, TRIBECA_CODERS } from "@tribecahq/tribeca-sdk";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { InputText } from "../../components/tribeca/common/inputs/InputText";
import { LabeledInput } from "../../components/tribeca/common/inputs/LabeledInput";
import { serializeToBase64 } from "../../utils/tribeca/makeTransaction";
import { useEnvironment } from "../../utils/tribeca/useEnvironment";
import React from "react";
export const WhitelistEscrow = ({ actor, ctx, payer, setTxRaw, }) => {
    const lockerKey = ctx?.locker;
    const governorKey = ctx?.governor;
    invariant(lockerKey && governorKey);
    const { network } = useEnvironment();
    invariant(network !== "localnet");
    const [programStr, setProgramStr] = useState("");
    const [ownerStr, setOwnerStr] = useState("");
    const programID = usePubkey(programStr);
    const owner = usePubkey(ownerStr);
    const { data: whitelistEntryKey } = useQuery({
        queryKey: ["whitelistEntryKey", programID?.toString(), owner?.toString()],
        queryFn: async () => {
            if (!programID || !owner) {
                return null;
            }
            const [whitelistEntry] = await findWhitelistAddress(lockerKey, programID, owner);
            return whitelistEntry;
        },
        staleTime: Infinity,
    });
    useEffect(() => {
        if (!programID || !owner || !whitelistEntryKey) {
            return;
        }
        void (async () => {
            const [whitelistEntry, bump] = await findWhitelistAddress(lockerKey, programID, owner);
            const ix = TRIBECA_CODERS.LockedVoter.encodeIX("approveProgramLockPrivilege", {
                bump,
            }, {
                locker: lockerKey,
                whitelistEntry,
                governor: governorKey,
                smartWallet: actor,
                payer,
                systemProgram: SystemProgram.programId,
                executableId: programID,
                whitelistedOwner: owner,
            });
            const fakeTX = buildStubbedTransaction(network, [ix]);
            setTxRaw(serializeToBase64(fakeTX));
        })();
    }, [
        actor,
        governorKey,
        lockerKey,
        network,
        owner,
        payer,
        programID,
        setTxRaw,
        whitelistEntryKey,
    ]);
    return (React.createElement(React.Fragment, null,
        React.createElement(LabeledInput, { Component: InputText, id: "owner", label: "Escrow Owner Address", type: "text", onChange: (e) => setOwnerStr(e.target.value) }),
        React.createElement(LabeledInput, { Component: InputText, id: "program", label: "Program ID", type: "text", onChange: (e) => setProgramStr(e.target.value) })));
};
