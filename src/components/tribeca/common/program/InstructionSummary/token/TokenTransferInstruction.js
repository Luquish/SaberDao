import { useToken, useTokenAccount } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { useMemo } from "react";
import React from "react";
import { AddressLink } from "../../../AddressLink";
import { TokenAmountDisplay } from "../../../TokenAmountDisplay";
export const TokenTransferInstruction = ({ transfer, }) => {
    const { data: recipientAccount } = useTokenAccount(transfer.destination);
    const { data: token } = useToken(recipientAccount?.account.mint);
    const amount = useMemo(() => (token ? new TokenAmount(token, transfer.amount) : null), [token, transfer.amount]);
    return (React.createElement("div", { className: "inline-flex flex-wrap gap-1" },
        "Transfer",
        " ",
        amount ? React.createElement(TokenAmountDisplay, { className: "font-semibold", amount: amount }) : "",
        " ",
        "to",
        " ",
        React.createElement(AddressLink, { className: "dark:text-primary dark:hover:text-white", address: recipientAccount?.account.owner ?? transfer.destination, showCopy: true })));
};
