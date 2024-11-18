import { useRewarder } from "@rockooor/react-quarry";
import { usePubkeysMemo, useTokens } from "@rockooor/sail";
import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import clsx from "clsx";
import { useSDK } from "../../../../../contexts/sdk";
import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { Button } from "../../../../../components/tribeca/common/Button";
import { TableCardBody } from "../../../../../components/tribeca/common/card/TableCardBody";
import { EmptyState, EmptyStateConnectWallet, } from "../../../../../components/tribeca/common/EmptyState";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { ModalButton } from "../../../../../components/tribeca/common/Modal/ModalButton";
import { useAllGauges } from "../hooks/useGauges";
import { GaugeWeightRow } from "./GaugeWeightRow";
import { SetWeightsModal } from "./SetWeightsModal";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    return {
        governor: paths[3] || '' // Asumiendo /tribeca/gov/:governor/
    };
}
export const GaugeWeightsForm = ({ filterTerm }) => {
    const location = useLocation();
    const { governor } = getParams(location.pathname);
    const { escrow, isLoading } = useUserEscrow();
    const { quarries, quarriesLoading } = useRewarder();
    const [filteredQuarries, setFilteredQuarries] = React.useState([]);
    const { sharesDiff } = useUpdateGaugeWeights();
    const { gauges } = useAllGauges();
    const { sdkMut } = useSDK();
    const allTokens = useTokens(usePubkeysMemo(quarries?.map((quarry) => quarry.quarry.account.tokenMintKey) ?? []));
    React.useEffect(() => {
        if (filterTerm === "") {
            setFilteredQuarries(quarries ?? []);
        }
        const filter = (quarries) => {
            return quarries.filter((quarry) => allTokens
                .find((tok) => tok.data?.mintAccount.equals(quarry.quarry.account.tokenMintKey))
                ?.data?.name.toLowerCase()
                .indexOf(filterTerm.toLowerCase()) !== -1);
        };
        const delaySearch = setTimeout(() => {
            if (quarries) {
                setFilteredQuarries(filter(quarries));
            }
        }, 100);
        return () => clearTimeout(delaySearch);
    }, [allTokens, filterTerm, quarries]);
    if (quarriesLoading) {
        return React.createElement(LoadingPage, { className: "p-16" });
    }
    if (!sdkMut) {
        return (React.createElement(EmptyStateConnectWallet, { title: "Connect your wallet to vote on gauges." }));
    }
    if (!escrow && !isLoading) {
        return (React.createElement(EmptyState, { title: "Locker Escrow Not Found", icon: React.createElement(FaExclamationCircle, null) },
            React.createElement("div", { className: "py-2.5" },
                React.createElement(Link, { to: `/tribeca/gov/${governor ?? ""}/locker`, className: clsx("w-full rounded text-sm font-semibold transition-colors", "hover:text-white") },
                    React.createElement(Button, { variant: "primary" }, "Lock Tokens")))));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement(TableCardBody, { head: React.createElement("tr", null,
                    React.createElement("th", null, "Token"),
                    React.createElement("th", null, "Current Share (%)"),
                    React.createElement("th", null, "Weight"),
                    React.createElement("th", null, "New Share (%)")) }, filteredQuarries.map((quarry) => gauges?.find((gauge) => gauge?.account.quarry.equals(quarry.key) &&
                !gauge.account.isDisabled) ? (React.createElement(GaugeWeightRow, { key: quarry.key.toString(), quarry: quarry })) : null))),
        React.createElement("div", { className: "w-full flex flex-col items-center p-8" },
            React.createElement(ModalButton, { buttonLabel: "Update Weights", buttonProps: {
                    variant: "outline",
                    disabled: sharesDiff.length === 0,
                    className: clsx("w-3/5", "hover:not-disabled:border-primary hover:not-disabled:text-primary"),
                } },
                React.createElement(SetWeightsModal, null)))));
};
