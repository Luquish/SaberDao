import { useToken, useTokenMint } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { Link } from "gatsby";
import React from "react";
import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "../../../../../utils/tribeca/format";
import { AddressLink } from "../../../../../components/tribeca/common/AddressLink";
import { ContentLoader } from "../../../../../components/tribeca/common/ContentLoader";
import { TokenAmountDisplay } from "../../../../../components/tribeca/common/TokenAmountDisplay";
export const SAVECard = ({ data }) => {
    const { path } = useGovernor();
    const { data: token } = useToken(data.account.mint);
    const { data: mintData } = useTokenMint(data.account.mint);
    const outstandingSupply = token && mintData
        ? new TokenAmount(token, mintData.account.supply)
        : undefined;
    return (React.createElement("div", { className: "text-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800" },
        React.createElement("div", { className: "flex flex-grow w-2/3" },
            React.createElement("div", { className: "flex-basis[236px] flex flex-col gap-1" },
                React.createElement("span", { className: "font-medium text-white" },
                    React.createElement(Link, { to: `/tribeca${path}/saves/${data.account.mint.toString()}` }, token?.name ?? "Loading...")),
                React.createElement("div", { className: "text-xs flex gap-1 text-secondary" },
                    React.createElement("span", null, "ID:"),
                    React.createElement(AddressLink, { address: data.account.mint, showCopy: true })))),
        React.createElement("div", { className: "flex flex-col gap-1" },
            React.createElement("div", { className: "flex gap-2" },
                React.createElement("span", null, "Min Lock Duration:"),
                React.createElement("span", { className: "text-white font-semibold" }, formatDurationSeconds(data.account.minLockDuration.toNumber()))),
            React.createElement("div", { className: "flex gap-2" },
                React.createElement("span", null, "Outstanding Supply:"),
                React.createElement("span", { className: "text-white font-semibold" }, outstandingSupply ? (React.createElement(TokenAmountDisplay, { amount: outstandingSupply })) : (React.createElement(ContentLoader, { className: "w-10 h-3" })))))));
};
