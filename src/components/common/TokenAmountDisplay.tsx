import type {
  IFormatUint,
  Percent,
  Token,
  TokenAmount,
} from "@saberhq/token-utils";
import React from "react";
import tw, { css, styled } from "twin.macro";

import { formatDisplayWithSoftLimit, formatPercent } from "../../utils/format";
import { TokenIcon } from "./TokenIcon";

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

export const TokenAmountDisplay: React.FC<Props> = ({
  amount,
  token = amount.token,
  isMonoNumber = false,
  showIcon = false,
  showSymbol = true,
  percent,
  className,
  suffix = "",
  exact = false,
}: Props) => {
  return (
    <TokenAmountWrapper className={className}>
      {showIcon && (
        <TokenIcon
          css={css`
            margin-right: 4px;
          `}
          token={token}
        />
      )}
      <TheNumber isMonoNumber={isMonoNumber}>
        {exact
          ? amount.toExact({ groupSeparator: "," })
          : formatDisplayWithSoftLimit(amount.asNumber, token.decimals)}
      </TheNumber>

      {showSymbol && (
        <span>
          {"\u00A0"}
          {token.symbol}
        </span>
      )}
      {percent && <PercentFmt>({formatPercent(percent)})</PercentFmt>}
      {suffix && <span>{suffix}</span>}
    </TokenAmountWrapper>
  );
};

const PercentFmt = styled.span`
  margin-left: 4px;
`;

const TokenAmountWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TheNumber = styled.span<{ isMonoNumber?: boolean }>`
  ${({ isMonoNumber }) =>
    isMonoNumber === true
      ? css`
          ${tw`font-mono`}
        `
      : undefined}
`;
