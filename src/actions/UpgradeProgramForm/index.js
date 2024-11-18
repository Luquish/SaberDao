import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { GiTumbleweed } from "react-icons/gi";
import { AddressLink } from "../../components/tribeca/common/AddressLink";
import { EmptyState } from "../../components/tribeca/common/EmptyState";
import { NoPrograms } from "../../components/tribeca/common/governance/NoPrograms";
import { Select } from "../../components/tribeca/common/inputs/InputText";
import { LoadingPage } from "../../components/tribeca/common/LoadingPage";
import { useSDK } from "../../contexts/sdk";
import { useGovernor } from "../../hooks/tribeca/useGovernor";
import { useAuthorityBuffers, useAuthorityPrograms, } from "../../hooks/tribeca/useAuthorityPrograms";
import { createUpgradeInstruction } from "../../utils/tribeca/instructions/upgradeable_loader/instructions";
import { makeTransaction } from "../../utils/tribeca/makeTransaction";
import { programLabel } from "../../utils/tribeca/programs";
import { useEnvironment } from "../../utils/tribeca/useEnvironment";
import { shortenAddress } from "../../utils/tribeca/utils";
import { BufferOption } from "./BufferOption";
import React from "react";
export const UpgradeProgramForm = ({ onSelect }) => {
    const { sdkMut } = useSDK();
    const { smartWallet } = useGovernor();
    const { data: buffers } = useAuthorityBuffers(smartWallet);
    const { programs, programData } = useAuthorityPrograms(smartWallet);
    const { network } = useEnvironment();
    const [programID, setProgramID] = useState(null);
    const [bufferKey, setBufferKey] = useState(null);
    useEffect(() => {
        if (!programID || !bufferKey || !sdkMut || !smartWallet) {
            return;
        }
        void (async () => {
            const ix = await createUpgradeInstruction({
                program: new PublicKey(programID),
                buffer: new PublicKey(bufferKey),
                spill: sdkMut.provider.wallet.publicKey,
                signer: smartWallet,
            });
            onSelect(makeTransaction(network, [ix]));
        })();
    }, [programID, bufferKey, network, sdkMut, onSelect, smartWallet]);
    return (React.createElement(React.Fragment, null,
        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "upgradeBuffer" },
            React.createElement("span", { className: "text-sm" }, "Program ID"),
            smartWallet ? (React.createElement(React.Fragment, null, programs?.length === 0 && !programData.isLoading ? (React.createElement(NoPrograms, { smartWallet: smartWallet })) : (React.createElement(Select, { onChange: (e) => {
                    setProgramID(e.target.value);
                } },
                React.createElement("option", null, "Select a program ID"),
                programs?.map((program) => {
                    const { data } = program;
                    if (!data) {
                        return null;
                    }
                    const programIDStr = data.programID.toString();
                    const label = programLabel(programIDStr);
                    return (React.createElement("option", { key: programIDStr, value: programIDStr }, label
                        ? `${label} (${shortenAddress(programIDStr, 3)})`
                        : shortenAddress(programIDStr, 10)));
                }))))) : (React.createElement(LoadingPage, null))),
        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "upgradeBuffer" },
            React.createElement("span", { className: "text-sm" }, "New Buffer"),
            smartWallet ? (React.createElement(React.Fragment, null, buffers?.length === 0 ? (React.createElement(EmptyState, { icon: React.createElement(GiTumbleweed, null), title: "No buffers available" },
                React.createElement("p", null,
                    "To propose a program upgrade, please upload a buffer with the",
                    React.createElement("br", null),
                    "upgrade authority",
                    " ",
                    React.createElement(AddressLink, { address: smartWallet, showCopy: true }),
                    " by following",
                    " ",
                    React.createElement("a", { className: "text-primary", href: "https://github.com/gokiprotocol/goki-cli", target: "_blank", rel: "noreferrer" }, "these instructions"),
                    "."))) : (React.createElement(Select, { onChange: (e) => {
                    setBufferKey(e.target.value);
                } },
                React.createElement("option", null, "Select a buffer"),
                buffers?.map((buffer) => (React.createElement(BufferOption, { key: buffer.pubkey.toString(), buffer: buffer }))))))) : (React.createElement(LoadingPage, null)))));
};
