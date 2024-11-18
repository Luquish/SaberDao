import React from "react";
import { useEnvironment } from "../../../utils/tribeca/useEnvironment";
import { shortenAddress } from "../../../utils/tribeca/utils";
import { ExternalLink } from "./typography/ExternalLink";
export const TXLink = ({ txSig, className, children, full, }) => {
    const { network } = useEnvironment();
    return (React.createElement(ExternalLink, { className: className, href: `https://explorer.solana.com/tx/${txSig}?cluster=${network?.toString() ?? ""}` }, children ?? (full ? txSig : shortenAddress(txSig))));
};
