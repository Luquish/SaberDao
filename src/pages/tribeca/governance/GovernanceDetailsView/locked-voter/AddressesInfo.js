import { PublicKey } from "@solana/web3.js";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";
export const AddressesInfo = ({ addresses }) => {
    return (React.createElement(Card, { title: "Related Accounts", bodyScrollX: true, tw: "col-span-full" },
        React.createElement(TableCardBody, null, Object.entries(addresses).map(([key, info]) => {
            return (React.createElement("tr", { key: key },
                React.createElement("td", null,
                    React.createElement("div", null,
                        React.createElement("span", { tw: "text-white font-semibold" }, info.label),
                        React.createElement("p", { tw: "text-gray" }, info.description))),
                React.createElement("td", null,
                    React.createElement(AddressWithContext, { pubkey: new PublicKey(info.address.toString()), prefixLinkUrlWithAnchor: true }))));
        }))));
};
