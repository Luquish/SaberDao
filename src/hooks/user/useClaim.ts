import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@saberhq/token-utils';
import { executeMultipleTxs } from '@/helpers/transaction';
import useUserGetLPTokenBalance from '@/hooks/user/useGetLPTokenBalance';
import useQuarryMiner from '@/hooks/user/useQuarryMiner';
import useProvider from '@/hooks/useProvider';
import { getClaimIxs } from '@/helpers/claim';
import useQuarry from '@/hooks/useQuarry';
import { PoolData } from '@/types';

export default function useClaim(pool: PoolData) {
    const { connection } = useConnection();
    const { wallet } = useWallet();
    const { data: balance } = useUserGetLPTokenBalance(pool.info.lpToken.address);
    const { data: miner } = useQuarryMiner(pool.info.lpToken, true);
    const { data: quarry } = useQuarry();
    const { saber } = useProvider();

    const claim = async () => {
        if (!miner || !quarry || !wallet?.adapter.publicKey || !saber) {
            return;
        }
        // Primary rewards
        const txs = await getClaimIxs(saber, quarry.sdk, miner, pool, wallet);
        try {
            await executeMultipleTxs(connection, txs, wallet);
        } catch (e) {
            console.log(e)
        }
    };

    return { claim };
}
