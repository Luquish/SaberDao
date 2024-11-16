import { lamportsToSolString } from "./sol";
import React from "react";

interface Props {
  lamports: number;
}

const SYMBOL = "◎";

export const SolAmount: React.FC<Props> = ({ lamports }: Props) => {
  return (
    <>
      {SYMBOL}
      {lamportsToSolString(lamports)}
    </>
  );
};
