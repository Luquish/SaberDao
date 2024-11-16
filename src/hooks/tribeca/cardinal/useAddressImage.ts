import { breakName } from "@cardinal/namespaces";
import { mapSome } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import makeBlockie from "ethereum-blockies-base64";
import { useEffect, useState } from "react";

import { useAddressName } from "./useAddressName";

const SUNSBR =
  "https://cdn.jsdelivr.net/gh/SunnyAggregator/sunny-token-list@master/icons/sunsbr.svg";

export const SUNSBR_OWNER = new PublicKey(
  "7vauTYofpkXXgDegQL9foGuqxBWZmaUKy8yeRyATTywg"
);

const getTwitterImage = async (handle: string): Promise<string | undefined> => {
  const response = await fetch(
    `https://api.cardinal.so/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${handle}&user.fields=profile_image_url`
  );
  const json = (await response.json()) as {
    data: { profile_image_url: string }[];
  };
  return json?.data[0]?.profile_image_url.replace("_normal", "") as string;
};

export const useAddressImage = (
  address: PublicKey | undefined
): { addressImage: string | null | undefined; loadingImage: boolean } => {
  const [addressImage, setAddressImage] = useState<string | null | undefined>(
    undefined
  );
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const { displayName, loadingName } = useAddressName(address);

  const refreshImage = async (displayName: string | null | undefined) => {
    if (!displayName) {
      setAddressImage(displayName);
    }
    try {
      setLoadingImage(true);
      const [_namespace, handle] = displayName ? breakName(displayName) : [];
      if (handle) {
        const imageUrl = await getTwitterImage(handle);
        setAddressImage(imageUrl);
      }
    } finally {
      setLoadingImage(false);
    }
  };

  const theAddressImage =
    addressImage ??
    mapSome(address, (a) => {
      if (a.equals(SUNSBR_OWNER)) {
        return SUNSBR;
      } else {
        return makeBlockie(a.toString());
      }
    });

  useEffect(() => {
    void refreshImage(displayName);
  }, [displayName]);
  return {
    addressImage: theAddressImage,
    loadingImage: loadingImage || loadingName,
  };
};
