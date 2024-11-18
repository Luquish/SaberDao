import { calculateEstimatedWithdrawAmount } from '@saberhq/stableswap-sdk';
import { Percent } from '@saberhq/token-utils';
export const calculateWithdrawAll = ({ poolTokenAmount, exchangeInfo, maxSlippagePercent, }) => {
    const result = calculateEstimatedWithdrawAmount({
        poolTokenAmount,
        reserves: exchangeInfo.reserves,
        fees: exchangeInfo.fees,
        lpTotalSupply: exchangeInfo.lpTotalSupply,
    });
    // minimum amounts to receive from withdraw, considering slippage
    const minimums = (result.withdrawAmounts.map((amount) => amount.reduceBy(maxSlippagePercent)) ?? [undefined, undefined]);
    return {
        estimates: result.withdrawAmounts,
        fees: result.fees,
        feePercents: [
            result.fees[0].divideBy(result.withdrawAmountsBeforeFees[0]),
            result.fees[1].divideBy(result.withdrawAmountsBeforeFees[1]),
        ],
        minimums,
        slippages: [new Percent(0, 1), new Percent(0, 1)],
    };
};
