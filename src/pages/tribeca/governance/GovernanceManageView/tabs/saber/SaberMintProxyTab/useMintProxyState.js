import { useParsedAccount } from "@rockooor/sail";
import { SABER_ADDRESSES, SABER_CODERS } from "@saberhq/saber-periphery";
import { PublicKey } from "@solana/web3.js";
const SABER_MINT_PROXY_STATE = new PublicKey("9qRjwMQYrkd5JvsENaYYxSCgwEuVhK4qAo5kCFHSmdmL");
const parser = {
    programID: SABER_ADDRESSES.MintProxy,
    name: "MintProxyInfo",
    parse: (data) => SABER_CODERS.MintProxy.coder.state.decode(data),
};
export const useMintProxyState = () => {
    return useParsedAccount(SABER_MINT_PROXY_STATE, parser);
};
