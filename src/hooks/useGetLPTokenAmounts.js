// src/hooks/useGetLPTokenAmounts.ts
import { useQuery } from '@tanstack/react-query';
import { chunk } from 'lodash';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import throat from 'throat';
import useNetwork from './useNetwork';
export default function useGetLPTokenAmounts(pools) {
    const { connection } = useConnection();
    const { endpoint } = useNetwork();
    return useQuery({
        queryKey: ['lpTokenAmounts', endpoint, (pools ?? []).length > 0 ? 'y' : 'n'],
        queryFn: async () => {
            if (!pools || pools.length === 0) {
                return null;
            }
            // First get all reserve token accounts we need to fetch info for
            const accounts = pools.map((pool) => pool.lpToken.address);
            // Chunk them in sets of 100
            const chunks = chunk(accounts, 100);
            // Ask the RPC to execute this
            const tokenAmounts = await Promise.all(chunks.map(throat(10, async (chunk) => {
                const result = await connection.getMultipleParsedAccounts(chunk.map((account) => new PublicKey(account)));
                return result.value.map((item, i) => {
                    return {
                        address: chunk[i],
                        amount: (item?.data).parsed.info.supply,
                    };
                });
            })));
            // Create object from the result
            const lpTokenAmounts = tokenAmounts.flat().reduce((acc, item) => {
                acc[item.address] = item.amount;
                return acc;
            }, {});
            return lpTokenAmounts;
        },
        staleTime: 1000 * 60,
        refetchInterval: 5000,
    });
}
