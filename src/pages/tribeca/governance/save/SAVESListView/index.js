import { useQuery } from "@tanstack/react-query";
import { findSaveAddress } from "@tribecahq/save";
import React from "react";
import { useGovernor, useGovWindowTitle, } from "@/hooks/tribeca/useGovernor";
import { useBatchedSAVEs } from "@/utils/tribeca/parsers";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { NotFoundPage } from "@/components/tribeca/common/NotFoundPage";
import { AboutSAVE } from "../common/AboutSAVE";
import { SAVECard } from "./SAVECard";
export const SAVESListView = () => {
    const { meta } = useGovernor();
    const saveMints = meta?.saves?.map((save) => save.mint);
    const { data: saveKeys } = useQuery({
        queryKey: ["saveKeysOfMints", saveMints?.map((sm) => sm.toString())],
        queryFn: async () => {
            if (!saveMints) {
                return null;
            }
            return await Promise.all(saveMints.map(async (saveMint) => {
                const [save] = await findSaveAddress(saveMint);
                return save;
            }));
        },
    });
    const { data: savesData } = useBatchedSAVEs(saveKeys);
    useGovWindowTitle(`Outstanding SAVEs`);
    return (React.createElement("div", null,
        React.createElement(GovernancePage, { title: "SAVE Tokens" },
            React.createElement("div", { className: "flex flex-col gap-8" },
                React.createElement(Card, { title: "Outstanding SAVEs", className: "flex-1" }, savesData ? (savesData.map((saveData) => saveData ? (React.createElement(SAVECard, { key: saveData.publicKey.toString(), data: saveData })) : null)) : savesData === undefined ? (React.createElement("div", null,
                    React.createElement(LoadingPage, null))) : (React.createElement("div", null,
                    React.createElement(NotFoundPage, null)))),
                React.createElement(AboutSAVE, null)))));
};
export default SAVESListView;
