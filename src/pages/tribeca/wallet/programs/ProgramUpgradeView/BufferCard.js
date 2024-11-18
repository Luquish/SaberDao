import { SmartWalletWrapper } from "@gokiprotocol/client";
import { useTXHandlers } from "@rockooor/sail";
import copyToClipboard from "copy-to-clipboard";
import filesize from "filesize";
import { FaDownload, FaRegCopy } from "react-icons/fa";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";
import { useSDK } from "../../../../../contexts/sdk";
import { truncateShasum } from "../../../../../hooks/tribeca/useSha256Sum";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/tribeca/useWrapTx";
import { SABER_DAO_SMART_WALLET_KEY, SABER_EMERGENCY_DAO, } from "../../../../../utils/tribeca/constants";
import { createCloseInstruction, createUpgradeInstruction, } from "../../../../../utils/tribeca/instructions/upgradeable_loader/instructions";
import { notify } from "../../../../../utils/tribeca/notifications";
import { AddressLink } from "../../../../../components/tribeca/common/AddressLink";
import { AsyncButton } from "../../../../../components/tribeca/common/AsyncButton";
export const BufferCard = ({ buffer, programID }) => {
    const { sdkMut } = useSDK();
    const { smartWallet, key, path } = useSmartWallet();
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    const { verifiableBuild } = buffer;
    return (React.createElement("div", { className: "flex items-center justify-between rounded bg-gray-50 border px-3 py-2 text-sm" },
        React.createElement("div", { className: "flex flex-grow gap-4" },
            React.createElement("div", { className: "flex-basis[125px] flex items-center font-medium" },
                React.createElement(AddressLink, { address: buffer.pubkey })),
            React.createElement("div", null,
                React.createElement("div", { className: "flex items-center gap-1 text-secondary" },
                    React.createElement("button", { className: "hover:text-primary flex items-center gap-1", onClick: () => {
                            const blob = new Blob([buffer.executableData], {
                                type: "application/octet-stream",
                            });
                            const link = document.createElement("a");
                            link.href = window.URL.createObjectURL(blob);
                            const fileName = `goki-${buffer.pubkey.toString()}.so`;
                            link.download = fileName;
                            link.click();
                        } },
                        React.createElement("span", null,
                            "Download (",
                            filesize(buffer.dataLen),
                            ")"),
                        React.createElement(FaDownload, null))),
                React.createElement("div", { className: "text-xs inline-flex gap-1 text-secondary" },
                    "SHA256:",
                    " ",
                    React.createElement("button", { type: "button", className: "flex items-center gap-0.5 text-gray-800 max-w-[200px] hover:(text-primary underline)", onClick: () => {
                            copyToClipboard(buffer.sha256Sum);
                            notify({
                                message: `Copied SHA256 hash to clipboard.`,
                                description: (React.createElement(React.Fragment, null,
                                    "You may verify the hash locally with",
                                    " ",
                                    React.createElement("code", null, "sha256sum <PROGRAM_FILEPATH>"),
                                    ".")),
                            });
                        } },
                        React.createElement("span", { className: "overflow-hidden overflow-ellipsis flex-grow-0" }, truncateShasum(buffer.sha256Sum, 8)),
                        React.createElement("div", { className: "flex-grow w-4 h-4 flex items-center" },
                            React.createElement(FaRegCopy, null)))),
                verifiableBuild && (React.createElement("div", { className: "text-xs inline-flex gap-1 text-secondary" },
                    React.createElement("span", null, "Build:"),
                    React.createElement("a", { className: "hover:underline", href: verifiableBuild.build.build.source, target: "_blank", rel: "noreferrer" },
                        verifiableBuild.program.name,
                        ":",
                        verifiableBuild.build.build.org,
                        "/",
                        verifiableBuild.build.build.repoName,
                        "@",
                        verifiableBuild.build.build.tag))))),
        React.createElement("div", { className: "flex flex-col gap-1 flex-shrink-0" },
            sdkMut && (React.createElement(React.Fragment, null,
                React.createElement(AsyncButton, { variant: "default", size: "sm", onClick: async () => {
                        invariant(smartWallet);
                        const { tx, index } = await smartWallet.newTransaction({
                            instructions: [
                                await createUpgradeInstruction({
                                    program: programID,
                                    buffer: buffer.pubkey,
                                    spill: smartWallet.provider.wallet.publicKey,
                                    signer: key,
                                }),
                            ],
                        });
                        await signAndConfirmTX(await wrapTx(tx), `Propose Upgrade`);
                        navigate(`${path}/tx/${index}`);
                    } }, "Upgrade"),
                smartWallet?.key.equals(SABER_DAO_SMART_WALLET_KEY) && (React.createElement(AsyncButton, { variant: "default", size: "sm", onClick: async () => {
                        invariant(smartWallet);
                        const emergencyDAOWallet = await SmartWalletWrapper.load(smartWallet.sdk, SABER_EMERGENCY_DAO);
                        const { tx: innerTx } = await smartWallet.newTransaction({
                            proposer: emergencyDAOWallet.key,
                            instructions: [
                                await createUpgradeInstruction({
                                    program: programID,
                                    buffer: buffer.pubkey,
                                    spill: emergencyDAOWallet.provider.wallet.publicKey,
                                    signer: key,
                                }),
                            ],
                        });
                        const { tx, index } = await emergencyDAOWallet.newTransaction({
                            instructions: innerTx.instructions,
                        });
                        invariant(tx.instructions[0]);
                        const ownerInvokerIndex = 0;
                        const executeTx = await emergencyDAOWallet.ownerInvokeInstructionV2({
                            instruction: tx.instructions[0],
                            index: ownerInvokerIndex,
                        });
                        await signAndConfirmTX(await wrapTx(executeTx), `Propose Upgrade`);
                        navigate(`/wallets/${emergencyDAOWallet.key.toString()}/tx/${index}`);
                    } }, "Upgrade as Emergency DAO")))),
            React.createElement(AsyncButton, { variant: "default", size: "sm", onClick: async () => {
                    invariant(smartWallet);
                    const { tx, index } = await smartWallet.newTransaction({
                        instructions: [
                            createCloseInstruction({
                                account: buffer.pubkey,
                                spill: smartWallet.provider.walletKey,
                                authority: key,
                            }),
                        ],
                    });
                    await signAndConfirmTX(await wrapTx(tx), `Propose Close`);
                    navigate(`${path}/tx/${index}`);
                } }, "Close"))));
};
