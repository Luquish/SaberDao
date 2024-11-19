import { useCardinalDisplayName } from "@/hooks/tribeca/cardinal/useAddressName";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import React from "react";
type Props = React.ComponentProps<typeof AddressLink>;

/**
 * An {@link AddressLink} which displays its name.
 *
 * @param param0
 * @returns
 */
export default function NamedAddressLink({
  address,
  children,
  ...rest
}: Props) {
  const { name } = useCardinalDisplayName(address);
  return (
    <AddressLink address={address} {...rest}>
      {children ?? name ?? undefined}
    </AddressLink>
  );
}