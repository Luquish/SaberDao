import { useMemo } from "react";
import { Link } from "gatsby";
import React from "react";
import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { useAuthorityPrograms } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { Button } from "../../../../../components/tribeca/common/Button";
import { NoPrograms } from "../../../../../components/tribeca/common/governance/NoPrograms";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { LoadingSpinner } from "../../../../../components/tribeca/common/LoadingSpinner";
import { Notice } from "../../../../../components/tribeca/common/Notice";
import { ProgramCard } from "./ProgramCard";
import { ProgramPlaceholder } from "./ProgramPlaceholder";
export const ProgramsList = ({ maxCount = 100 }) => {
    const { smartWallet, path } = useGovernor();
    const { programs, programData } = useAuthorityPrograms(smartWallet);
    const programsToRender = useMemo(() => programs.slice(0, maxCount), [maxCount, programs]);
    if (!smartWallet || programData.isLoading) {
        return (React.createElement("div", { className: "h-[251px] flex items-center justify-center" },
            React.createElement(LoadingPage, null)));
    }
    const isEmpty = programs.length === 0 && programData.isFetched;
    if (isEmpty) {
        return React.createElement(NoPrograms, { smartWallet: smartWallet });
    }
    return (React.createElement(React.Fragment, null,
        programs.length === 0 &&
            programData.data?.map((pdata) => (React.createElement(Notice, { key: pdata.pubkey.toString() },
                React.createElement(LoadingSpinner, null)))),
        React.createElement("div", { className: "flex flex-col gap-2" }, programsToRender.map((program, i) => {
            return (React.createElement("div", { key: program.data?.programID.toString() ?? `loading_${i}` },
                program.isLoading && React.createElement(ProgramPlaceholder, null),
                program.data && (React.createElement(ProgramCard, { program: program.data, actions: React.createElement(Link, { to: `/tribeca${path}/proposals/create` },
                        React.createElement(Button, { className: "py-2 px-3 hover:dark:text-primary hover:dark:border-primary", variant: "outline" }, "Upgrade")) }))));
        }))));
};
