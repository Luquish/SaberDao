import { useAccountData, usePubkey } from "@rockooor/sail";
import { partition } from "lodash-es";
import { FaSync, FaUpload } from "react-icons/fa";
import { useLocation } from "@reach/router";
import React from "react";
import { useAuthorityBuffers } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { useProgramLabel } from "../../../../../hooks/tribeca/useProgramMeta";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { BPF_UPGRADEABLE_LOADER_ID } from "../../../../../utils/tribeca/instructions/upgradeable_loader/instructions";
import { Button } from "../../../../../components/tribeca/common/Button";
import { ErrorMessage } from "../../../../../components/tribeca/common/ErrorMessage";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { Notice } from "../../../../../components/tribeca/common/Notice";
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { BasicSection } from "../../../../../components/tribeca/common/page/Section";
import { ProseSmall } from "../../../../../components/tribeca/common/typography/Prose";
import { BufferCard } from "./BufferCard";
function getParams(pathname) {
    const paths = pathname.split('/');
    const programID = paths[paths.indexOf('programs') + 2] || '';
    return { programID };
}
export const ProgramUpgradeView = () => {
    const { key } = useSmartWallet();
    const buffers = useAuthorityBuffers(key);
    const location = useLocation();
    const { programID: programIDStr } = getParams(location.pathname);
    const programID = usePubkey(programIDStr);
    const { data: program } = useAccountData(programID);
    const programLabel = useProgramLabel(programID);
    const isProgram = program
        ? program?.accountInfo.owner.equals(BPF_UPGRADEABLE_LOADER_ID)
        : program;
    const [myBuffers, otherBuffers] = partition(buffers.data?.sort((a, b) => a.pubkey.toString().localeCompare(b.pubkey.toString())) ?? [], (buffer) => buffer.verifiableBuild?.program.address === programIDStr);
    return (React.createElement(BasicPage, { title: `Upgrade Program ${programLabel}`, description: `Program ID: ${programID?.toString() ?? programIDStr ?? "--"}` },
        React.createElement("div", { className: "grid gap-12" },
            React.createElement(Notice, { icon: React.createElement(FaUpload, null), title: "How do I upgrade a program?" },
                React.createElement(ProseSmall, null,
                    React.createElement("ol", null,
                        React.createElement("li", null,
                            "Build your program, ideally using",
                            " ",
                            React.createElement("code", null, "anchor build --verifiable"),
                            "."),
                        React.createElement("li", null,
                            "Upload your program's buffer via",
                            React.createElement("br", null),
                            React.createElement("code", null, "solana program write-buffer <PROGRAM_FILEPATH>"),
                            ".",
                            React.createElement("br", null),
                            "This will give you a buffer key. Keep track of this!"),
                        React.createElement("li", null,
                            "Change the program's upgrade authority to this smart wallet via",
                            React.createElement("br", null),
                            React.createElement("code", null,
                                "solana program set-buffer-authority <BUFFER_KEY> --new-buffer-authority ",
                                key.toString()),
                            "."),
                        React.createElement("li", null, "Use the tool below to select the buffer to upgrade, and propose the transaction.")))),
            React.createElement(BasicSection, { title: "Verified Buffers", actions: React.createElement(Button, { onClick: async () => {
                        await buffers.refetch();
                    } },
                    React.createElement(FaSync, null),
                    " ") },
                (buffers.isLoading || program === undefined) && React.createElement(LoadingPage, null),
                buffers.isError && React.createElement(ErrorMessage, { error: buffers.error }),
                isProgram && programID && (React.createElement("div", null,
                    buffers.data?.length === 0 && (React.createElement(Notice, null,
                        React.createElement("p", null, "There are no buffers owned by this smart wallet."),
                        React.createElement("p", null, "Follow the instructions above to upload the bytecode for a new program upgrade."))),
                    React.createElement("div", { className: "grid gap-2" }, myBuffers.map((buffer) => (React.createElement(BufferCard, { key: buffer.pubkey.toString(), buffer: buffer, programID: programID }))))))),
            programID && otherBuffers.length > 0 && (React.createElement(BasicSection, { title: "Available Buffers", actions: React.createElement(Button, { onClick: async () => {
                        await buffers.refetch();
                    } },
                    React.createElement(FaSync, null),
                    " ") },
                React.createElement("div", { className: "grid gap-2" }, otherBuffers.map((buffer) => (React.createElement(BufferCard, { key: buffer.pubkey.toString(), buffer: buffer, programID: programID })))))))));
};
