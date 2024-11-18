import { FaRegQuestionCircle } from "react-icons/fa";
import { useLocation } from "@reach/router";
import React from "react";
import { EmptyState } from "../../../components/tribeca/common/EmptyState";
import { Card } from "../../../components/tribeca/common/governance/Card";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    return {
        governor: paths[3] || '' // Asumiendo /tribeca/gov/:governor/
    };
}
const GovernanceNotFoundPage = () => {
    const location = useLocation();
    const { governor: governorStr } = getParams(location.pathname);
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "bg-warmGray-900 pb-24" },
            React.createElement("div", { className: "max-w-5xl w-11/12 mx-auto" },
                React.createElement("div", { className: "flex flex-col gap-4 md:gap-8 md:flex-row md:min-h-[120px] flex-wrap items-center justify-between w-full" },
                    React.createElement("div", { className: "flex flex-col self-start md:self-center" },
                        React.createElement("h1", { className: "text-2xl md:text-3xl font-bold text-white tracking-tighter" }, "Not Found"))))),
        React.createElement("div", { className: "max-w-5xl w-11/12 mx-auto" },
            React.createElement("main", { className: "w-full -mt-16 mb-20" },
                React.createElement(Card, { title: "Governance Not Found" },
                    React.createElement(EmptyState, { icon: React.createElement(FaRegQuestionCircle, null), title: "Governance Not Found" },
                        React.createElement("div", { className: "max-w-sm text-center mt-4" },
                            React.createElement("p", null,
                                "We couldn't find a DAO at ",
                                governorStr,
                                ". Please check the address and try again."))))))));
};

export default GovernanceNotFoundPage;
