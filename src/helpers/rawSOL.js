import { mapSome } from '@saberhq/solana-contrib';
import { NATIVE_MINT, RAW_SOL } from '@saberhq/token-utils';
export const rawSOLOverride = (token) => {
    return mapSome(token, (t) => t.mintAccount.equals(NATIVE_MINT) ? RAW_SOL[t.network] : t);
};
