import type { PublicKey } from "@solana/web3.js";
import copy from "copy-to-clipboard";
import React from "react";
import { FaRegCopy } from "react-icons/fa";
import tw, { styled } from "twin.macro";

import { notify } from "../../utils/notifications";
import { displayAddress } from "../../utils/programs";
import { useEnvironment } from "../../utils/useEnvironment";
import { shortenAddress } from "../../utils/utils";

interface Props {
  address: PublicKey;
  className?: string;
  showCopy?: boolean;
  children?: React.ReactNode;
  showRaw?: boolean;
  shorten?: boolean;
  prefixLinkUrlWithAnchor?: boolean;
}

export const AddressLink: React.FC<Props> = ({
  address,
  className,
  shorten = true,
  showCopy = false,
  showRaw = true,
  prefixLinkUrlWithAnchor = false,
  children,
}: Props) => {
  const { network } = useEnvironment();
  const urlPrefix = prefixLinkUrlWithAnchor
    ? "https://anchor.so"
    : "https://explorer.solana.com";
  return (
    <Wrapper>
      <a
        className={className}
        tw="text-gray-800 dark:text-warmGray-200 hover:text-primary"
        href={`${urlPrefix}/address/${address.toString()}?cluster=${
          network?.toString() ?? ""
        }`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children ??
          (showRaw
            ? shorten
              ? shortenAddress(address.toString())
              : address.toString()
            : displayAddress(address.toString(), shorten))}
      </a>
      {showCopy && (
        <CopyIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copy(address.toString());
            notify({ message: "Copied address to clipboard." });
          }}
        />
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  ${tw`inline-flex items-center`}
`;

const CopyIcon = styled(FaRegCopy)`
  ${tw`ml-1 cursor-pointer text-gray-800 dark:text-warmGray-200 hover:text-primary`}
`;
