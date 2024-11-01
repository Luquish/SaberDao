import type { PublicKey } from "@solana/web3.js";
import makeBlockie from "ethereum-blockies-base64";
import { FaTwitter } from "react-icons/fa";
import { css } from "twin.macro";

import { useAddressImage } from "../../../../../hooks/cardinal/useAddressImage";
import { useCardinalDisplayName } from "../../../../../hooks/cardinal/useAddressName";
import { AddressLink } from "../../../../common/AddressLink";
import { ContentLoader } from "../../../../common/ContentLoader";

interface Props {
  voterKey?: PublicKey | null;
}

export const VoterHeader: React.FC<Props> = ({ voterKey }: Props) => {
  const { displayName, name } = useCardinalDisplayName(voterKey ?? undefined);
  const { addressImage, loadingImage } = useAddressImage(voterKey ?? undefined);
  return (
    <div tw="flex items-center gap-2.5">
      <div tw="h-11 w-11 flex">
        {loadingImage || !voterKey ? (
          <ContentLoader tw="h-full w-full rounded-full" />
        ) : (
          <img
            tw="h-full w-full rounded-full"
            alt={`Profile of ${displayName ?? voterKey.toString()}`}
            src={addressImage ?? makeBlockie(voterKey.toString())}
          />
        )}
      </div>
      <div tw="flex flex-col gap-0.5">
        <div tw="flex items-center gap-3">
          <h1 tw="text-2xl md:text-3xl font-bold text-white tracking-tighter">
            {displayName}
          </h1>
          {name?.startsWith("@") && (
            <a
              href={`https://twitter.com/${name.slice(1)}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter
                tw="h-5 w-5"
                css={css`
                  color: #1da1f2;
                `}
              />
            </a>
          )}
        </div>
        <div tw="h-6 flex items-center dark:text-warmGray-400">
          {voterKey ? (
            <AddressLink
              tw="dark:text-warmGray-400 font-semibold text-xs"
              address={voterKey}
              shorten={false}
              showCopy
            />
          ) : (
            <ContentLoader tw="w-48 h-4" />
          )}
        </div>
      </div>
    </div>
  );
};
