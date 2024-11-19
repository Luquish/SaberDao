import type {
  IFormatUint,
  Percent,
  Token,
  TokenAmount,
} from "@saberhq/token-utils";
import React from "react";
import clsx from "clsx";

import { formatDisplayWithSoftLimit, formatPercent } from "@/utils/tribeca/format";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";

export interface Props extends IFormatUint {
  token?: Token;
  amount: TokenAmount;
  isMonoNumber?: boolean;
  showIcon?: boolean;
  percent?: Percent;
  className?: string;
  showSymbol?: boolean;
  suffix?: string;
  exact?: boolean;
}

export function TokenAmountDisplay({
  amount,
  token = amount.token,
  isMonoNumber = false,
  showIcon = false,
  showSymbol = true,
  percent,
  className,
  suffix = "",
  exact = false,
}: Props) {
  return (
    <div className={clsx("flex items-center", className)}>
      {showIcon && (
        <TokenIcon
          className="mr-1"
          token={token}
        />
      )}
      <span className={clsx(isMonoNumber && "font-mono")}>
        {exact
          ? amount.toExact({ groupSeparator: "," })
          : formatDisplayWithSoftLimit(amount.asNumber, token.decimals)}
      </span>

      {showSymbol && (
        <span>
          {"\u00A0"}
          {token.symbol}
        </span>
      )}
      {percent && <span className="ml-1">({formatPercent(percent)})</span>}
      {suffix && <span>{suffix}</span>}
    </div>
  );
}
