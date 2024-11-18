import { usePubkey, useToken } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
import { findSaveAddress } from "@tribecahq/save";
import { useLocation } from "@reach/router";
import React from "react";
import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { useSAVEData } from "../../../../../utils/tribeca/parsers";
import { AddressLink } from "../../../../../components/tribeca/common/AddressLink";
import { Card } from "../../../../../components/tribeca/common/governance/Card";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { NotFoundPage } from "../../../../../components/tribeca/common/NotFoundPage";
import { IssueSAVEForm } from "./IssueSAVEForm";
import { LockSAVEForm } from "./LockSAVEForm";
import { SAVEDetails } from "./SAVEDetails";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const saveMintStr = paths[paths.indexOf('saves') + 1] || '';
    return { saveMintStr };
}
export const SAVEIndexView = () => {
    const { path, govToken, daoName } = useGovernor();
    const location = useLocation();
    const { saveMintStr } = getParams(location.pathname);
    const saveMintKey = usePubkey(saveMintStr);
    const { data: saveToken } = useToken(saveMintKey);
    const { data: saveKey } = useQuery({
        queryKey: ["saveMint", saveMintKey?.toString()],
        queryFn: async () => {
            if (!saveMintKey) {
                return null;
            }
            const [save] = await findSaveAddress(saveMintKey);
            return save;
        },
    });
    const { data: saveData } = useSAVEData(saveKey);
    const tokenName = saveToken?.name ?? `${govToken?.symbol ?? daoName ?? "DAO"} SAVE Token`;
    useGovWindowTitle(`Issue ${tokenName}`);
    return (React.createElement("div", null,
        React.createElement(GovernancePage, { backLink: {
                label: "SAVEs",
                href: `${path}/saves`,
            }, title: `Issue ${tokenName}`, header: React.createElement("div", { className: "h-6 flex items-center dark:text-warmGray-400 text-sm font-semibold" }, saveMintKey ? (React.createElement(AddressLink, { className: "dark:text-warmGray-400", address: saveMintKey, showCopy: true })) : (React.createElement("div", null, "--"))) }, saveData ? (React.createElement("div", { className: "flex flex-col md:flex-row gap-8" },
            React.createElement("div", { className: "flex-1" },
                React.createElement("div", { className: "flex flex-col gap-4" },
                    React.createElement(Card, { title: "Issue SAVE Tokens" },
                        React.createElement("div", { className: "px-7 py-5" },
                            React.createElement(IssueSAVEForm, { saveData: saveData }))),
                    React.createElement(Card, { title: "Lock SAVE Tokens" },
                        React.createElement("div", { className: "px-7 py-5" },
                            React.createElement(LockSAVEForm, { saveData: saveData }))))),
            React.createElement("div", { className: "flex-1" },
                React.createElement(Card, { title: "About" },
                    React.createElement(SAVEDetails, { saveData: saveData }))))) : saveData === undefined ? (React.createElement("div", null,
            React.createElement(LoadingPage, null))) : (React.createElement("div", null,
            React.createElement(NotFoundPage, null))))));
};
export default SAVEIndexView;
