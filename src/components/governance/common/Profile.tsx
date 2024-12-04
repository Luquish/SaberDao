import type { PublicKey } from "@solana/web3.js";
import makeBlockie from "ethereum-blockies-base64";
import { FaTwitter } from "react-icons/fa";
import { Link } from "@reach/router";
import tw from "twin.macro";
import { css } from "styled-components";

import { useAddressImage } from "@/hooks/governance/cardinal/useAddressImage";
import { useCardinalDisplayName } from "@/hooks/governance/cardinal/useAddressName";
import { AddressLink } from "@/components/governance/AddressLink";
import { ContentLoader } from "@/components/governance/ContentLoader";

interface Props {
  address: PublicKey;
  href?: string;
}

export const Profile: React.FC<Props> = ({ address, href }: Props) => {
  const { name, displayName } = useCardinalDisplayName(address);
  const { addressImage, loadingImage } = useAddressImage(address);
  const image = (
    <img
      tw="h-10 w-10 rounded-full"
      alt={`Profile of ${displayName ?? address.toString()}`}
      src={addressImage ?? makeBlockie(address.toString())}
    />
  );
  return (
    <div tw="text-sm">
      <div tw="flex gap-2 items-center">
        <div tw="h-10 w-10 rounded-full flex">
          {loadingImage ? (
            <ContentLoader tw="h-10 w-10 rounded-full" />
          ) : href ? (
            <Link to={href}>{image}</Link>
          ) : (
            image
          )}
        </div>
        <div tw="flex flex-col leading-normal">
          <div tw="flex gap-1 items-center">
            <div tw="h-5 flex items-center">
              {displayName === undefined ? (
                <ContentLoader tw="h-4 w-12 rounded" />
              ) : (
                <span
                  tw={`${name ? 'text-white' : 'text-gray-400'} font-medium`}
                >
                  {displayName}
                </span>
              )}
            </div>
            {name?.startsWith("@") && (
              <a
                href={`https://twitter.com/${name.slice(1)}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter tw="text-[#1da1f2] font-medium" />
              </a>
            )}
          </div>
          <AddressLink tw="text-gray-400" address={address} showCopy />
        </div>
      </div>
    </div>
  );
};
