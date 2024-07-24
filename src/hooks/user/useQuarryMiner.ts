import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { Token, TokenInfo } from '@saberhq/token-utils';
import useQuarry from '../useQuarry';
import { SBR_REWARDER } from '@saberhq/saber-periphery';
import useGetSwaps from '../useGetSwaps';
import useNetwork from '../useNetwork';
import { PublicKey } from '@solana/web3.js';
import useGetRewarders from '../useGetRewarders';
import { MergeMiner, MergePool } from '@quarryprotocol/quarry-sdk';
import BN from 'bn.js';

export default function useQuarryMiner(lpToken: TokenInfo, fetchData = false) {
    const { wallet } = useWallet();
    const { formattedNetwork, network } = useNetwork();
    const { data: swaps } = useGetSwaps(formattedNetwork);
    const { data: quarry } = useQuarry();
    const { data: rewarders } = useGetRewarders(network);

    return useQuery({
        queryKey: ['miner', wallet?.adapter.publicKey?.toString(), lpToken.address, `${fetchData}`],
        queryFn: async () => {
            if (!quarry || !rewarders) {
                return null;
            }

            const rewarderW = await quarry.sdk.mine.loadRewarderWrapper(SBR_REWARDER);
            const quarryW = await rewarderW.getQuarry(new Token(lpToken));

            if (!wallet?.adapter.publicKey) {
                return { quarry: quarryW };
            }

            const minerW = await quarryW.getMinerActions(wallet.adapter.publicKey);

            let minerData;
            console.log(fetchData)
            if (fetchData) {
                try {
                    minerData = await minerW.fetchData();
                } catch (e) {
                    console.log(e)
                    // not initialised
                }
            }

            console.log('miner', minerW);
            console.log('quarry', quarryW);

            const addresses = swaps?.find((swap) => swap.addresses.lpTokenMint === lpToken.address);
            const mergePoolAddress = addresses?.addresses.mergePool;
            const replicaInfo = mergePoolAddress && rewarders?.find(rewarder => rewarder.mergePool === mergePoolAddress);

            let mergeMiner: MergeMiner | null = null;
            let mergePool: MergePool | null = null;

            let stakedBalance = new BN(0);

            // @TODO: HANDLE legacy and merge miner
            if (replicaInfo && replicaInfo.isReplica) {
                mergePool = quarry.sdk.mergeMine.loadMP({ mpKey: new PublicKey(replicaInfo.mergePool) });
                const mmKey = await mergePool.mergeMine.findMergeMinerAddress({
                    owner: wallet.adapter.publicKey,
                    pool: new PublicKey(replicaInfo.mergePool)
                });
                mergeMiner = await quarry.sdk.mergeMine.loadMM({
                    mmKey
                });

                stakedBalance = mergeMiner.mm.data.primaryBalance;
            } else {
                stakedBalance = minerData?.balance ?? new BN(0);
            }

            return {
                miner: minerW,
                quarry: quarryW,
                rewarderW,
                data: fetchData ? minerData : undefined,
                mergeMiner,
                replicaInfo,
                mergePool,
                stakedBalance,
            };
        },
        enabled: !!lpToken && !!quarry && !!rewarders,
        refetchInterval: 60000,
    });
}