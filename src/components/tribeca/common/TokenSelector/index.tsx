import type { Token } from "@saberhq/token-utils";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import React from "react";

import LoadingSpinner from "@/components/tribeca/common/LoadingSpinner";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";
import { SelectTokenModal } from "@/components/tribeca/common/TokenSelector/SelectTokenModal";

interface Props {
  className?: string;
  tokens: readonly Token[];
  token: Token | null;
  isLoading?: boolean;
  onSelect?: (token: Token) => void;
}

export const TokenSelector: React.FC<Props> = ({
  className,
  tokens,
  token,
  onSelect,
  isLoading,
}: Props) => {
  const [showSelector, setShowSelector] = useState<boolean>(false);

  return (
    <>
      <AssetSelectButton
        className="h-full"
        noAsset={!token}
        disabled={!onSelect}
        onClick={() => setShowSelector(!showSelector)}
      >
        {token ? (
          <div className="flex items-center gap-3">
            <TokenIcon size={32} token={token} />
            <div>
              <div className="font-medium">{token.name}</div>
              <div className="leading-none text-secondary">{token.symbol}</div>
            </div>
          </div>
        ) : isLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <div>Select a token</div>
        )}
        {onSelect && (
          <div className="text-base flex items-center ml-6">
            <FiChevronDown />
          </div>
        )}
      </AssetSelectButton>
      {!isLoading && onSelect && (
        <SelectTokenModal
          tokens={tokens}
          isOpen={showSelector}
          onDismiss={() => {
            setShowSelector(false);
          }}
          onSelect={(token) => {
            onSelect?.(token);
            setShowSelector(false);
          }}
        />
      )}
    </>
  );
};

function getAssetSelectButtonClasses({
  disabled,
  noAsset,
  className = "",
}: {
  disabled?: boolean;
  noAsset?: boolean;
  className?: string;
}): string {
  return `
    relative text-left flex flex-none items-center justify-between
    appearance-none text-base
    whitespace-nowrap py-2 px-4 rounded
    ${disabled ? "cursor-default" : "cursor-pointer hover:bg-gray-100 active:bg-gray-200"}
    ${!disabled && noAsset ? "hover:bg-gray-100 active:bg-gray-200" : ""}
    ${className}
  `.trim();
}

function AssetSelectButton({
  children,
  noAsset,
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { noAsset?: boolean }) {
  return (
    <button
      className={getAssetSelectButtonClasses({ disabled, noAsset, className })}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
