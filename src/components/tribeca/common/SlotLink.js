import React from "react";
import { CURRENT_APP } from "../../../config";
import { useEnvironment } from "../../../utils/tribeca/useEnvironment";
export const SlotLink = ({ slot, className, children, }) => {
    const { network } = useEnvironment();
    const isTribeca = CURRENT_APP === "tribeca";
    return (React.createElement("a", { className: className, href: `https://explorer.solana.com/block/${slot}?cluster=${network?.toString() ?? ""}`, target: "_blank", rel: "noopener noreferrer" }, children ?? slot.toLocaleString()));
};
