import { useProgramLabel } from "@/hooks/tribeca/useProgramMeta";
import { SYSVAR_OWNER } from "@/utils/tribeca/programs";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import React from "react";

type Props = React.ComponentProps<typeof AddressLink>;

/**
 * Renders a program label.
 * @returns
 */
export const ProgramLabel: React.FC<Props> = ({ address, ...rest }: Props) => {
  const label = useProgramLabel(address);
  if (address.equals(SYSVAR_OWNER)) {
    return <>SYSVAR</>;
  }
  return (
    <AddressLink
      className="dark:text-primary hover:text-opacity-80"
      address={address}
      {...rest}
    >
      {label}
    </AddressLink>
  );
};
