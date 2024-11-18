import { useProgramLabel } from "../../../../hooks/tribeca/useProgramMeta";
import { SYSVAR_OWNER } from "../../../../utils/tribeca/programs";
import { AddressLink } from "../AddressLink";
import React from "react";
/**
 * Renders a program label.
 * @returns
 */
export const ProgramLabel = ({ address, ...rest }) => {
    const label = useProgramLabel(address);
    if (address.equals(SYSVAR_OWNER)) {
        return React.createElement(React.Fragment, null, "SYSVAR");
    }
    return (React.createElement(AddressLink, { className: "dark:text-primary hover:text-opacity-80", address: address, ...rest }, label));
};
