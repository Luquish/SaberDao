import { useSail } from "@rockooor/sail";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import invariant from "tiny-invariant";
import React from "react";
import { useAuthorityPrograms } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/tribeca/useWrapTx";
import { createSetAuthorityInstruction, findProgramDataAddress, } from "../../../../../utils/tribeca/instructions/upgradeable_loader/instructions";
import { displayAddress } from "../../../../../utils/tribeca/programs";
import { AsyncButton } from "../../../../../components/tribeca/common/AsyncButton";
import { EmptyState, EmptyStateConnectWallet, } from "../../../../../components/tribeca/common/EmptyState";
import { ErrorMessage } from "../../../../../components/tribeca/common/ErrorMessage";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { LoadingSpinner } from "../../../../../components/tribeca/common/LoadingSpinner";
import { Notice } from "../../../../../components/tribeca/common/Notice";
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { ReactComponent as EmptyFolder } from "../../../../../components/tribeca/common/svgs/EmptyFolder.svg";
import { ProgramCard } from "../WalletProgramsView/ProgramCard";
export const ProgramImportView = () => {
    const wallet = useAnchorWallet();
    const { key } = useSmartWallet();
    const { programs, programData } = useAuthorityPrograms(wallet?.publicKey);
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    return (React.createElement(BasicPage, { title: "Import a Program", description: "Transfer the upgrade authority of one of your programs to your Smart Wallet." },
        !wallet && (React.createElement(EmptyStateConnectWallet, { title: "Connect your wallet to import a program." })),
        programData.isLoading ? (React.createElement(LoadingPage, null)) : (programs.length === 0 &&
            programData.data?.map((pdata) => (React.createElement(Notice, { key: pdata.pubkey.toString() },
                React.createElement(LoadingSpinner, null))))),
        programs.length === 0 && programData.isFetched && (React.createElement(EmptyState, { icon: React.createElement(EmptyFolder, null), title: "Your connected wallet doesn't own any programs." },
            React.createElement("div", { className: "text-secondary flex flex-col items-center gap-2 mt-4" },
                React.createElement("p", null, "You must connect to the upgrade authority wallet in order to import programs."),
                React.createElement("p", null,
                    "Haven't deployed yet?",
                    " ",
                    React.createElement("a", { className: "text-primary", href: "https://docs.solana.com/cli/deploy-a-program", target: "_blank", rel: "noreferrer" }, "View the official guide"))))),
        React.createElement("div", { className: "flex flex-col gap-2" }, programs.map((program, i) => {
            return (React.createElement("div", { key: program.data?.programID.toString() ?? `loading_${i}` },
                program.isLoading && React.createElement(LoadingSpinner, null),
                program.isError && React.createElement(ErrorMessage, { error: program.error }),
                program.data && (React.createElement(ProgramCard, { program: program.data, actions: React.createElement(AsyncButton, { onClick: async (sdkMut) => {
                            invariant(program.data);
                            const [programData] = await findProgramDataAddress(program.data.programID);
                            await handleTX(await wrapTx(sdkMut.provider.newTX([
                                createSetAuthorityInstruction({
                                    account: programData,
                                    authority: sdkMut.provider.wallet.publicKey,
                                    nextAuthority: key,
                                }),
                            ])), `Transfer authority of ${displayAddress(program.data.programID.toString())} to Smart Wallet`);
                        } }, "Transfer Authority") }))));
        }))));
};
