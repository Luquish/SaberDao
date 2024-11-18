import { useCardinalDisplayName } from "../../../../hooks/tribeca/cardinal/useAddressName";
import { AddressLink } from "../AddressLink";
import React from "react";
/**
 * An {@link AddressLink} which displays its name.
 *
 * @param param0
 * @returns
 */
export const NamedAddressLink = ({ address, children, ...rest }) => {
    const { name } = useCardinalDisplayName(address);
    return (React.createElement(AddressLink, { address: address, ...rest }, children ?? name ?? undefined));
};
