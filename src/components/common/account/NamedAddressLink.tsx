import { useCardinalDisplayName } from "../../../hooks/cardinal/useAddressName";
import { AddressLink } from "../AddressLink";
import React from "react";

type Props = React.ComponentProps<typeof AddressLink>;

/**
 * An {@link AddressLink} which displays its name.
 *
 * @param param0
 * @returns
 */
export const NamedAddressLink: React.FC<Props> = ({
  address,
  children,
  ...rest
}: Props) => {
  const { name } = useCardinalDisplayName(address);
  return (
    <AddressLink address={address} {...rest}>
      {children ?? name ?? undefined}
    </AddressLink>
  );
};
