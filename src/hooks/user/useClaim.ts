import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@saberhq/token-utils';
import { executeMultipleTxs } from '@/src/helpers/transaction';
import useUserGetLPTokenBalance from '@/src/hooks/user/useGetLPTokenBalance';
import useQuarryMiner from '@/src/hooks/user/useQuarryMiner';
import useProvider from '@/src/hooks/useProvider';
import { getClaimIxs } from '@/src/helpers/claim';
import useQuarry from '@/src/hooks/useQuarry';
import { PoolData } from '@/src/types';

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
