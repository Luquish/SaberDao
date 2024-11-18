import { formatNetwork, PendingTransaction } from "@saberhq/solana-contrib";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { capitalize } from "lodash-es";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useProvider } from "../../../../../hooks/tribeca/useProvider";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { useTokenAccounts } from "../../../../../hooks/tribeca/useTokenAccounts";
import { notify } from "../../../../../utils/tribeca/notifications";
import { Button } from "../../../../../components/tribeca/common/Button";
import { TokenAmountDisplay } from "../../../../../components/tribeca/common/TokenAmountDisplay";
import { TokenIcon } from "../../../../../components/tribeca/common/TokenIcon";
export const Tokens = () => {
    const { provider, network } = useProvider();
    const { key } = useSmartWallet();
    const balances = useTokenAccounts(key);
    return (React.createElement("div", { className: "flex flex-col gap-4" },
        React.createElement("div", { className: "flex items-center gap-4" },
            React.createElement(Link, { to: `/wallets/${key.toString()}/treasury/deposit` },
                React.createElement(Button, null, "Deposit")),
            network !== "mainnet-beta" && (React.createElement(Button, { onClick: async () => {
                    const result = new PendingTransaction(provider.connection, await provider.connection.requestAirdrop(key, 5 * LAMPORTS_PER_SOL));
                    notify({
                        message: `Requesting ${capitalize(network)} SOL from faucet`,
                        txid: result.signature,
                    });
                    await result.wait();
                } },
                "Request ",
                capitalize(formatNetwork(network)),
                " SOL"))),
        React.createElement("div", { className: "text-sm" }, balances.data?.map(({ balance: amount }, i) => (React.createElement("div", { key: i, className: clsx("flex items-center gap-4 py-2", i !== 0 && "border-t") },
            React.createElement(TokenIcon, { token: amount.token }),
            React.createElement("div", { className: "w-[220px] font-semibold" }, amount.token.name),
            React.createElement("div", { className: "flex-grow text-secondary" },
                React.createElement(TokenAmountDisplay, { amount: amount })),
            React.createElement("div", null,
                React.createElement(Link, { to: `/wallets/${key.toString()}/treasury/send/${amount.token.address}` },
                    React.createElement(Button, { variant: "primary", size: "sm" }, "Send")))))))));
};
