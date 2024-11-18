import { RAW_SOL_MINT, TokenAmount, WRAPPED_SOL, getATAAddressesSync } from '@saberhq/token-utils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { memoize } from 'lodash';
import { create, windowScheduler } from '@yornaath/batshit';
const batcherFn = memoize((connection, owner) => create({
    name: 'userATA',
    fetcher: async (query) => {
        const userAtasObj = getATAAddressesSync({
            mints: query.filter((x) => !!x).reduce((acc, mint, i) => {
                acc[i] = new PublicKey(mint.mint.address);
                return acc;
            }, {}),
            owner,
        });
        const userAtas = query.filter((x) => !!x).map((mint, i) => ({
            mint,
            ata: userAtasObj.accounts[i].address,
        }));
        const result = await connection.getMultipleParsedAccounts(userAtas.map((account) => account.ata));
        const data = await Promise.all(result.value.map(async (item, i) => {
            try {
                if (!userAtas[i].mint.ignoreWrap && (userAtas[i].mint.mint.address === RAW_SOL_MINT.toString() || userAtas[i].mint.mint.address === WRAPPED_SOL['mainnet-beta'].address)) {
                    const solBalance = await connection.getBalance(owner);
                    return {
                        mint: userAtas[i].mint.mint.address,
                        ignoreWrap: userAtas[i].mint.ignoreWrap,
                        key: userAtas[i].ata,
                        balance: new TokenAmount(userAtas[i].mint.mint, solBalance.toString()),
                        isInitialized: true,
                    };
                }
                return {
                    mint: userAtas[i].mint.mint.address,
                    ignoreWrap: userAtas[i].mint.ignoreWrap,
                    key: userAtas[i].ata,
                    balance: new TokenAmount(userAtas[i].mint.mint, (item?.data).parsed.info.tokenAmount.amount),
                    isInitialized: true,
                };
            }
            catch (e) {
                return {
                    mint: userAtas[i].mint.mint.address,
                    ignoreWrap: userAtas[i].mint.ignoreWrap,
                    key: userAtas[i].ata,
                    balance: new TokenAmount(userAtas[i].mint.mint, 0),
                    isInitialized: false,
                };
            }
        }));
        return data;
    },
    resolver: (atas, query) => {
        return atas?.find(ata => ata.mint === query?.mint?.address && ata.ignoreWrap === query.ignoreWrap) ?? null;
    },
    scheduler: windowScheduler(500),
}));
let batcher = null;
export default function useUserATA(mint, ignoreWrap = false) {
    const { wallet } = useWallet();
    const { connection } = useConnection();
    return useQuery({
        queryKey: ['userATA', wallet?.adapter.publicKey, mint?.address, ignoreWrap],
        queryFn: async () => {
            if (!wallet?.adapter.publicKey) {
                return null;
            }
            if (!batcher) {
                batcher = batcherFn(connection, wallet.adapter.publicKey);
            }
            return batcher.fetch({ mint, ignoreWrap });
        },
        refetchInterval: 5000,
        enabled: !!connection && !!wallet?.adapter.publicKey,
    });
}
