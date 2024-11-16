import type { Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import React from "react";

import { theme } from "../../../../theme";
import { TokenAmountDisplay } from "../TokenAmountDisplay";
import { TokenSelector } from "../TokenSelector";
import { InputDecimal } from "./InputDecimal";

interface IProps {
  label: string;
  tokens: readonly Token[];
  onTokenSelect?: (token: Token) => void;
  token: Token | null;
  inputValue: string;
  inputOnChange?: (val: string) => void;
  inputDisabled?: boolean;
  isLoading?: boolean;
  className?: string;

  currentAmount?: {
    amount?: TokenAmount;
    allowSelect?: boolean;
    label?: string;
  };
}

/**
 * Selects a token and its amount
 * @param param0
 * @returns
 */
export const InputTokenAmount: React.FC<IProps> = ({
  label,
  tokens,
  onTokenSelect,
  token,
  inputValue,
  inputOnChange,
  inputDisabled = false,
  currentAmount,
  className,
  isLoading,
}: IProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        {token && (
          <div>
            {currentAmount ? (
              <Balance>
                <span>{currentAmount.label ?? "Balance"}:</span>
                {currentAmount.amount ? (
                  <Accent
                    onClick={
                      currentAmount.allowSelect
                        ? () => {
                            inputOnChange?.(
                              currentAmount.amount?.toExact() ?? "0"
                            );
                          }
                        : undefined
                    }
                  >
                    <TokenAmountDisplay
                      amount={currentAmount.amount ?? new TokenAmount(token, 0)}
                      exact
                    />
                  </Accent>
                ) : (
                  <NoAmount>--</NoAmount>
                )}
              </Balance>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <TokenSelector
          className="bg-white border dark:(bg-warmGray-800 border-warmGray-600) rounded w-[200px]"
          tokens={tokens}
          isLoading={isLoading}
          token={token}
          onSelect={onTokenSelect}
        />
        <InputDecimal
          className="flex-grow text-right w-1/2 bg-transparent dark:bg-warmGray-800 border-none"
          placeholder="0.00"
          disabled={inputDisabled}
          value={inputValue}
          onChange={inputOnChange}
        />
      </div>
    </div>
  );
};

function NoAmount({ children }: { children: React.ReactNode }) {
    return <span className="ml-2 text-gray-800">{children}</span>;
  }
  
  function Accent({ 
    children, 
    onClick 
  }: { 
    children: React.ReactNode;
    onClick?: () => void;
  }) {
    return (
      <span 
        className={`ml-2 text-primary ${onClick ? 'cursor-pointer hover:underline' : ''}`}
        onClick={onClick}
      >
        {children}
      </span>
    );
  }
  
  function Balance({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center font-normal text-[13px] text-default">
        {children}
      </div>
    );
  }