import { lamportsToSolString } from "./sol";
import React from "react";
const SYMBOL = "◎";
export const SolAmount = ({ lamports }) => {
    return (React.createElement(React.Fragment, null,
        SYMBOL,
        lamportsToSolString(lamports)));
};
