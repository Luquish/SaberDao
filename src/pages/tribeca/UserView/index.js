import { GOKI_ADDRESSES } from "@gokiprotocol/client";
import { useQueries } from "@tanstack/react-query";
import { Link } from "gatsby";
import invariant from "tiny-invariant";
import React from "react";
import { useProvider } from "../../../hooks/tribeca/useProvider";
import { getGPAConnection } from "../../../utils/tribeca/gpaConnection";
import { displayAddress } from "../../../utils/tribeca/programs";
import { LoadingSpinner } from "../../../components/tribeca/common/LoadingSpinner";
import { WalletButton } from "../../../components/tribeca/layout/GovernorLayout/Header/WalletButton";
const AMOUNT_OFFSET_BYTES = 8 + 32 + 1 + 8 + 8 + 8 + 4 + 8 + 4;
export const UserView = () => {
    const { network, providerMut } = useProvider();
    const userKey = providerMut?.wallet.publicKey;
    const wallets = useQueries({
        queries: Array(3)
            .fill(null)
            .map((_, i) => ({
            queryKey: ["walletsForUser", network, userKey?.toString(), i],
            queryFn: async () => {
                invariant(userKey, "userKey");
                // https://github.com/solana-labs/solana/blob/master/cli/src/program.rs#L1142
                const result = await getGPAConnection({ network }).getProgramAccounts(GOKI_ADDRESSES.SmartWallet, {
                    filters: [
                        {
                            memcmp: {
                                offset: AMOUNT_OFFSET_BYTES + i * 32,
                                bytes: userKey.toString(),
                            },
                        },
                    ],
                });
                return result.map((r) => r.pubkey);
            },
            enabled: !!userKey,
        })),
    });
    const allWallets = wallets
        .flatMap((w) => w.data)
        .filter((k) => !!k);
    return (React.createElement("div", { className: "w-11/12 max-w-sm" },
        React.createElement("h1", { className: "font-bold text-3xl mb-4" }, "Wallets"),
        React.createElement("div", { className: "prose prose-sm mb-4" },
            React.createElement("p", null, "This is a list of the wallets you are a signer on."),
            React.createElement("p", null, "If you are not one of the first few signers on the wallet, your wallet may not show up here. In that case, please visit the wallet's page directly.")),
        allWallets.length === 0 &&
            (wallets.find((w) => w.isLoading) ? (React.createElement(LoadingSpinner, null)) : (React.createElement("div", { className: "p-4 rounded border bg-gray-50 text-sm flex flex-col items-center gap-4" }, providerMut ? (React.createElement(React.Fragment, null,
                React.createElement("p", null, "No wallets found."),
                React.createElement("span", null,
                    "Would you like to",
                    " ",
                    React.createElement(Link, { to: "/onboarding/new" }, "create a wallet"),
                    "?"))) : (React.createElement(React.Fragment, null,
                React.createElement("p", null, "Connect your wallet to view your Goki smart wallets."),
                React.createElement(WalletButton, null)))))),
        React.createElement("div", { className: "flex flex-col gap-2" }, allWallets.map((wallet) => {
            return (React.createElement("div", { className: "p-4 rounded border bg-gray-50", key: wallet.toString() },
                React.createElement(Link, { className: "text-sm font-semibold", to: `/wallets/${wallet.toString()}` }, displayAddress(wallet.toString()))));
        }))));
};
export default UserView;
