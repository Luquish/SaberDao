import { PublicKey } from '@solana/web3.js';
import { mapValues } from 'lodash';
export const valuesToKeys = (raw) => mapValues(raw, (addr) => new PublicKey(addr));
