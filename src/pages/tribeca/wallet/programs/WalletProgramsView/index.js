import { Link } from "gatsby";
import React from "react";
import { useAuthorityPrograms } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { Button } from "../../../../../components/tribeca/common/Button";
import { EmptyState } from "../../../../../components/tribeca/common/EmptyState";
import { ErrorMessage } from "../../../../../components/tribeca/common/ErrorMessage";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { LoadingSpinner } from "../../../../../components/tribeca/common/LoadingSpinner";
import { Notice } from "../../../../../components/tribeca/common/Notice";
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { ReactComponent as EmptyFolder } from "../../../../../components/tribeca/common/svgs/EmptyFolder.svg";
import { ProgramCard } from "./ProgramCard";
export const WalletProgramsView = () => {
    const { key, path } = useSmartWallet();
    const { programs, programData } = useAuthorityPrograms(key);
    const isEmpty = programs.length === 0 && programData.isFetched;
    return (React.createElement(BasicPage, { title: "Programs", description: "Manage the programs that this wallet can upgrade." },
        programData.isLoading ? (React.createElement(LoadingPage, null)) : (programs.length === 0 &&
            programData.data?.map((pdata) => (React.createElement(Notice, { key: pdata.pubkey.toString() },
                React.createElement(LoadingSpinner, null))))),
        isEmpty && (React.createElement(EmptyState, { icon: React.createElement(EmptyFolder, null), title: "This wallet doesn't own any programs." },
            React.createElement(Link, { to: `/tribeca/wallets/${key.toString()}/programs/import`, className: "text-primary" }, "Import a program"))),
        React.createElement("div", { className: "flex flex-col gap-2" }, programs.map((program, i) => {
            return (React.createElement("div", { key: program.data?.programID.toString() ?? `loading_${i}` },
                program.isLoading && React.createElement(LoadingSpinner, null),
                program.isError && React.createElement(ErrorMessage, { error: program.error }),
                program.data && (React.createElement(ProgramCard, { program: program.data, actions: React.createElement(Link, { to: `${path}/programs/${program.data.programID.toString()}/upgrade` },
                        React.createElement(Button, null, "Upgrade")) }))));
        })),
        !isEmpty && (React.createElement("div", { className: "mt-6" },
            React.createElement(Link, { to: `${path}/programs/import` },
                React.createElement(Button, null, "Import an existing program"))))));
};
