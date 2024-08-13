import invariant from 'tiny-invariant';
import { SABER_IOU_MINT, SBR_MINT, SBR_REWARDER, Saber } from '@saberhq/saber-periphery';
import { Token, TokenAmount, TokenInfo, getOrCreateATAs } from '@saberhq/token-utils';
import { Wallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import useQuarryMiner from '../hooks/user/useQuarryMiner';
import { QuarrySDK, findMergeMinerAddress, findReplicaMintAddress } from '@quarryprotocol/quarry-sdk';
import { findMergePoolAddress, getReplicaRewards } from './replicaRewards';
import BN from 'bn.js';
import { createQuarryPayroll } from './quarry';
import { ReplicaQuarryInfo } from './rewarder';
import { SBR_INFO } from '../utils/builtinTokens';
import { saberQuarryInfo } from '../constants';

const getClaimReplicaIx = async (
    quarry: QuarrySDK,
    miner: ReturnType<typeof useQuarryMiner>['data'],
    lpToken: TokenInfo,
    replicaQuarryInfo: ReplicaQuarryInfo,
    wallet: Wallet,
) => {
    invariant(wallet.adapter.publicKey);
    invariant(miner?.mergeMiner);

    // Get the amount to claim. If <=0, skip.
    const replicaRewards = await getReplicaRewards(
        quarry,
        lpToken,
        replicaQuarryInfo,
        wallet.adapter.publicKey
    );

    if (!replicaRewards) {
        return [];
    }
    
    const { payroll, replicaMinerData } = replicaRewards;
    
    const rewards = new TokenAmount(new Token({
        ...replicaQuarryInfo.rewardsToken,
        symbol: 'R',
        chainId: 103,
        address: replicaQuarryInfo.rewardsToken.mint,
        name: 'Reward token'
    }), payroll.calculateRewardsEarned(
        new BN(Math.floor(Date.now() / 1000)),
        replicaMinerData.balance,
        replicaMinerData.rewardsPerTokenPaid,
        replicaMinerData.rewardsEarned,
    ));

    const reward = rewards.asNumber;
    if (reward > 0) {
        const T = await miner.mergeMiner.claimReplicaRewards(new PublicKey(replicaQuarryInfo.rewarder));
        return T.instructions;
    }

    return [];
}

const getClaimPrimaryIx = async (
    quarry: QuarrySDK,
    miner: ReturnType<typeof useQuarryMiner>['data'],
    lpToken: TokenInfo,
    replicaQuarryInfo: Pick<ReplicaQuarryInfo, 'rewardsToken'>,
    wallet: Wallet,
) => {
    invariant(wallet.adapter.publicKey);
    invariant(miner?.mergePool);

    const mergePoolAddress = findMergePoolAddress({
        primaryMint: new PublicKey(lpToken.address),
    });
    const [mmAddress] = await findMergeMinerAddress({
        pool: mergePoolAddress,
        owner: wallet.adapter.publicKey,
    })

    const replicaMiner = await miner.quarry.getMinerActions(mmAddress);
    const replicaMinerData = await replicaMiner.fetchData()

    const payroll = createQuarryPayroll(replicaMiner.quarry.quarryData);
    const rewards = new TokenAmount(new Token({
        ...replicaQuarryInfo.rewardsToken,
        symbol: 'R',
        chainId: 103,
        address: replicaQuarryInfo.rewardsToken.mint,
        name: 'Reward token'
    }), payroll.calculateRewardsEarned(
        new BN(Math.floor(Date.now() / 1000)),
        replicaMinerData.balance,
        replicaMinerData.rewardsPerTokenPaid,
        replicaMinerData.rewardsEarned,
    ));
    const reward = rewards.asNumber;
    if (reward > 0) {
        const T2 = await miner.mergePool.claimPrimaryRewards(SBR_REWARDER, mmAddress);
        return T2.instructions;
    }

    return [];
}

export const getClaimIxs = async (
    saber: Saber,
    quarry: QuarrySDK,
    miner: ReturnType<typeof useQuarryMiner>['data'],
    lpToken: TokenInfo,
    wallet: Wallet,
) => {
    invariant(wallet.adapter.publicKey);
    invariant(miner?.miner);

    const txToExecute: {
        txs: TransactionInstruction[],
        description: string
    }[] = [];

    // Calculate actual legacy rewards, as we can't trust the quarry miner data rewardsEarned.
    const payroll = createQuarryPayroll(miner.miner.quarry.quarryData);
    const legacyRewards = new TokenAmount(new Token(SBR_INFO), payroll.calculateRewardsEarned(
        new BN(Math.floor(Date.now() / 1000)),
        miner.stakedBalanceLegacy,
        miner.data?.rewardsPerTokenPaid ?? new BN(0),
        miner.data?.rewardsEarned ?? new BN(0),
    ));

    if (legacyRewards.asNumber > 0) {
        const claimTx = await miner.miner.claim();
        txToExecute.push({
            txs: [...claimTx.instructions],
            description: 'Claim rewards'
        });
    }

    // Calculate MM rewards from primary miner
    if (miner.mergeMinerData) {
        const payrollMM = createQuarryPayroll(miner.miner.quarry.quarryData);
        const mmRewards = new TokenAmount(new Token(SBR_INFO), payrollMM.calculateRewardsEarned(
            new BN(Math.floor(Date.now() / 1000)),
            miner.stakedBalanceMM,
            miner.mergeMinerData.rewardsPerTokenPaid,
            miner.mergeMinerData.rewardsEarned,
        ));

        if (mmRewards.asNumber > 0) {
            txToExecute.push({
                txs: [...await getClaimPrimaryIx(
                    quarry,
                    miner,
                    lpToken,
                    saberQuarryInfo,
                    wallet
                )],
                description: 'Claim rewards'
            });
        }
    }
    

    // Secondary rewards
    if (miner.mergeMiner && miner.replicaInfo) {
        try {
            await Promise.all(miner.replicaInfo.replicaQuarries.map(async (replicaQuarryInfo) => {
                invariant(miner.mergeMiner);
                invariant(miner.mergePool);
                invariant(wallet.adapter.publicKey);

                const instructions: TransactionInstruction[] = [];

                // Add replica claim
                instructions.push(...await getClaimReplicaIx(
                    quarry,
                    miner,
                    lpToken,
                    replicaQuarryInfo,
                    wallet
                ));

                // Add primary claim
                instructions.push(...await getClaimPrimaryIx(
                    quarry,
                    miner,
                    lpToken,
                    replicaQuarryInfo,
                    wallet
                ));

                txToExecute.push({
                    txs: instructions,
                    description: 'Claim replica rewards'
                });
            }));
        } catch (e) {
            // Do nothing
        }
    }

    // Redeem tx
    const redeemer = await saber.loadRedeemer({
        iouMint: SABER_IOU_MINT,
        redemptionMint: new PublicKey(SBR_MINT),
    });

    const { accounts, instructions } = await getOrCreateATAs({
        provider: saber.provider,
        mints: {
            iou: redeemer.data.iouMint,
            redemption: redeemer.data.redemptionMint,
        },
        owner: wallet.adapter.publicKey,
    });

    const redeemTx = await redeemer.redeemAllTokensFromMintProxyIx({
        iouSource: accounts.iou,
        redemptionDestination: accounts.redemption,
        sourceAuthority: wallet.adapter.publicKey,
    });

    txToExecute.push({
        txs: [...instructions, redeemTx],
        description: 'Redeem IOU'
    });

    return txToExecute;
};
