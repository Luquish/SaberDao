import type { PublicKey } from "@solana/web3.js";
import { FaTwitter } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useAddressImage } from "../../../../hooks/tribeca/cardinal/useAddressImage";
import { useCardinalDisplayName } from "../../../../hooks/tribeca/cardinal/useAddressName";
import { AddressLink } from "../AddressLink";
import { ContentLoader } from "../ContentLoader";

interface Props {
  address: PublicKey;
  href?: string;
}

interface ContentLoaderProps {
  className?: string;
}

// Componente ContentLoader con tipos correctos
const StyledContentLoader: React.FC<ContentLoaderProps> = ({ className }) => (
  <ContentLoader>
    <rect className={className} />
  </ContentLoader>
);

export const Profile: React.FC<Props> = ({ address, href }: Props) => {
  const { name, displayName } = useCardinalDisplayName(address);
  const { addressImage, loadingImage } = useAddressImage(address);
  
  // Generamos un placeholder si no hay imagen
  const generatePlaceholder = () => {
    const str = address.toString();
    return `data:image/svg+xml,<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23${str.slice(2,8)}"/></svg>`;
  };
  
  const image = (
    <img
      className="h-10 w-10 rounded-full"
      alt={`Profile of ${displayName ?? address.toString()}`}
      src={addressImage ?? generatePlaceholder()}
    />
  );

  return (
    <div className="text-sm">
      <div className="flex gap-2 items-center">
        <div className="h-10 w-10 rounded-full flex">
          {loadingImage ? (
            <StyledContentLoader className="h-10 w-10 rounded-full" />
          ) : href ? (
            <Link to={href}>{image}</Link>
          ) : (
            image
          )}
        </div>
        <div className="flex flex-col leading-normal">
          <div className="flex gap-1 items-center">
            <div className="h-5 flex items-center">
              {displayName === undefined ? (
                <StyledContentLoader className="h-4 w-12 rounded" />
              ) : (
                <span
                  className={clsx(
                    "font-medium",
                    name ? "text-white" : "text-warmGray-400"
                  )}
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
                <FaTwitter
                  className="text-[#1da1f2]"
                />
              </a>
            )}
          </div>
          <AddressLink className="text-gray-400" address={address} showCopy />
        </div>
      </div>
    </div>
  );
};
