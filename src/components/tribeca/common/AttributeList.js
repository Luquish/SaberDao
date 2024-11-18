import { Percent, Price, Token, TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { startCase } from "lodash-es";
import React from "react";
import { formatPercent } from "../../../utils/tribeca/format";
import { NamedAddressLink } from "./account/NamedAddressLink";
import { AddressLink } from "./AddressLink";
import { DisplayValue } from "./DisplayValue";
import { LoadingSpinner } from "./LoadingSpinner";
import { TokenAmountDisplay } from "./TokenAmountDisplay";
export const AttributeList = ({ className, loading = true, attributes, rowStyles, labelStyles, valueStyles, transformLabel = true, }) => {
    return (React.createElement("div", { className: `flex flex-col text-sm ${className}` }, Object.entries(attributes).map(([label, attribute], i) => (React.createElement("div", { className: "flex justify-between items-center px-6 py-2 gap-4", style: {
            ...(i !== 0 && { borderTop: '1px solid #808080' }),
        }, key: label },
        React.createElement("div", { className: "text-secondary dark:text-gray-400 font-semibold", style: labelStyles }, transformLabel ? startCase(label) : label),
        React.createElement("div", { className: "font-medium", style: valueStyles }, attribute === undefined ? (loading ? (React.createElement(LoadingSpinner, null)) : ("(undefined)")) : attribute === null ? ("(null)") : attribute instanceof Date ? (attribute.getTime() === 0 ? ("never") : (attribute.toLocaleString())) : attribute instanceof PublicKey ? (React.createElement(AddressLink, { address: attribute, showCopy: true })) : typeof attribute === "object" &&
            "_bn" in attribute ? (React.createElement(AddressLink, { address: new PublicKey(attribute.toString()), showCopy: true })) : attribute instanceof TokenAmount ? (React.createElement(TokenAmountDisplay, { showIcon: true, amount: attribute })) : attribute instanceof Token ? (React.createElement(NamedAddressLink, { address: attribute.mintAccount, showCopy: true }, attribute.name)) : attribute instanceof Price ? (React.createElement(React.Fragment, null,
            attribute.asFraction.toFixed(3),
            " ",
            attribute.quoteCurrency.symbol,
            " /",
            " ",
            attribute.baseCurrency.symbol)) : attribute instanceof Percent ||
            (typeof attribute === "object" &&
                attribute?.isPercent) ? (formatPercent(attribute)) : typeof attribute === "string" ? (attribute) : typeof attribute === "number" ? (attribute.toLocaleString()) : typeof attribute === "boolean" ? (attribute.toLocaleString()) : BN.isBN(attribute) ? (attribute.toString()) : Array.isArray(attribute) ? (attribute.length === 0 ? ("(empty)") : (React.createElement("div", { className: "flex flex-col gap-2" }, attribute.map((at, i) => (React.createElement(DisplayValue, { key: i, value: at })))))) : Buffer.isBuffer(attribute) ? (attribute.toString("hex")) : // eslint-disable-next-line @typescript-eslint/ban-types
            React.isValidElement(attribute) ? attribute : ("unknown"
            // (attribute as React.ReactNode)
            )))))));
};
