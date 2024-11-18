import { isPublicKey } from "@saberhq/solana-contrib";
import { Percent, Price, Token, TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import BN, { isBN } from "bn.js";
import { startCase } from "lodash-es";
import React from "react";
import { formatPercent } from "../../../utils/tribeca/format";
import { fmtObject } from "../../../pages/tribeca/InspectorPage/SimulationSection/AccountDiff/makeDiff";
import { NamedAddressLink } from "./account/NamedAddressLink";
import { TableCardBody } from "./card/TableCardBody";
import { LoadingSpinner } from "./LoadingSpinner";
import { AddressWithContext } from "./program/AddressWithContext";
import { TokenAmountDisplay } from "./TokenAmountDisplay";
export const DisplayValue = ({ className, loading = true, value, }) => {
    return (React.createElement("div", { className: className }, value === undefined ? (loading ? (React.createElement(LoadingSpinner, null)) : ("(undefined)")) : value === null ? ("(null)") : value instanceof Date ? (value.getTime() === 0 ? ("never") : (value.toLocaleString())) : isBN(value) ? (value.bitLength() > 53 ? (value.toString()) : (value.toNumber().toLocaleString())) : isPublicKey(value) ? (React.createElement(AddressWithContext, { pubkey: new PublicKey(value) })) : value instanceof TokenAmount ? (React.createElement(TokenAmountDisplay, { showIcon: true, amount: value })) : value instanceof Token ? (React.createElement(NamedAddressLink, { address: value.mintAccount, showCopy: true }, value.name)) : value instanceof Price ? (React.createElement(React.Fragment, null,
        value.asFraction.toFixed(3),
        " ",
        value.quoteCurrency.symbol,
        " /",
        " ",
        value.baseCurrency.symbol)) : value instanceof Percent ||
        (typeof value === "object" &&
            value?.isPercent) ? (formatPercent(value)) : typeof value === "string" ? (value) : typeof value === "number" ? (value.toLocaleString()) : typeof value === "boolean" ? (value.toLocaleString()) : BN.isBN(value) ? (value.toString()) : // eslint-disable-next-line @typescript-eslint/ban-types
        React.isValidElement(value) ? value : Array.isArray(value) ? (React.createElement("div", { className: "flex flex-col gap-1" }, value.map((v, i) => (React.createElement(DisplayValue, { key: i, value: v }))))) : typeof value === "object" ? (React.createElement(TableCardBody, null, Object.entries(value).map(([k, v]) => {
            return (React.createElement("tr", { key: k },
                React.createElement("td", null, startCase(k)),
                React.createElement("td", null,
                    React.createElement("div", { className: "flex flex-col items-end" },
                        React.createElement(DisplayValue, { value: v })))));
        }))) : (React.createElement("pre", null,
            React.createElement("code", null, fmtObject(value))))));
};
