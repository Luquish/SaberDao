import React, { useMemo } from 'react';
import H2 from '../H2';
import Input, { InputType } from '../Input';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import useQuarryMiner from '../../hooks/user/useQuarryMiner';
import BigNumber from 'bignumber.js';
import { useMutation } from '@tanstack/react-query';
import { useWithdraw } from '../../hooks/user/useWithdraw';
import { Token, TokenAmount } from '@saberhq/token-utils';
import { useStableSwapTokens } from '../../hooks/useStableSwapTokens';
import { calculateWithdrawAll } from '../../hooks/user/useWithdraw/calculateWithdrawAll';
import useSettings from '../../hooks/useSettings';
import { toPrecision } from '../../helpers/number';
import useUserGetLPTokenBalance from '../../hooks/user/useGetLPTokenBalance';
export default function UnunstakeForm(props) {
    const { register, watch, setValue } = useForm();
    const { data: miner, refetch } = useQuarryMiner(props.pool.info.lpToken, true);
    const { refetch: refetchLP } = useUserGetLPTokenBalance(props.pool.pair.pool.state.poolTokenMint.toString());
    const tokens = useStableSwapTokens(props.pool);
    const { maxSlippagePercent } = useSettings();
    const amount = watch('amount');
    const withdraw = useWithdraw({
        withdrawPoolTokenAmount: TokenAmount.parse(new Token(props.pool.info.lpToken), amount ? `${amount}` : '0'),
        withdrawToken: undefined, // Always do a balanced withdraw. We can optionally later swap to one using Jup for better price
        wrappedTokens: tokens?.wrappedTokens,
        pool: props.pool,
        actions: {
            withdraw: false,
            unstake: true,
        },
    });
    const { mutate: execUnstake, isPending, isSuccess, data: hash } = useMutation({
        mutationKey: ['unstake'],
        mutationFn: async () => {
            if (!amount) {
                return;
            }
            await withdraw?.handleWithdraw();
            refetch();
            refetchLP();
        },
    });
    const stakedUsdValue = useMemo(() => {
        if (!miner?.data) {
            return 0;
        }
        const values = calculateWithdrawAll({
            poolTokenAmount: TokenAmount.parse(new Token(props.pool.info.lpToken), (amount ?? 0).toString()),
            maxSlippagePercent,
            exchangeInfo: props.pool.exchangeInfo,
        });
        const valueA = values.estimates[0] ? values.estimates[0].asNumber : 0;
        const valueB = values.estimates[1] ? values.estimates[1].asNumber : 0;
        const usdValue = valueA * props.pool.usdPrice.tokenA + valueB * props.pool.usdPrice.tokenB;
        return usdValue;
    }, [miner, amount]);
    const balance = useMemo(() => {
        if (!miner?.stakedBalance) {
            return 0;
        }
        const balance = BigNumber(miner.stakedBalance.toString());
        return balance.div(new BigNumber(10 ** miner.miner.quarry.token.decimals)).toNumber();
    }, [miner]);
    return (React.createElement("div", { className: "w-full" },
        React.createElement(H2, null, "Unstake"),
        React.createElement("p", { className: "text-secondary text-sm" }, "Unstake your staked liquidity."),
        React.createElement(Input, { align: "right", register: register('amount'), type: InputType.NUMBER, placeholder: "0.00", size: "full" }),
        React.createElement("div", { className: "text-white text-xs text-right my-5" },
            "Balance:",
            ' ',
            React.createElement("div", { className: "text-saber-light cursor-pointer inline", onClick: () => setValue('amount', balance) }, balance)),
        isPending
            ? React.createElement(Button, { disabled: true, size: "full" }, "Unstaking...")
            : React.createElement(Button, { size: "full", onClick: () => execUnstake(), disabled: !amount }, "Unstake"),
        React.createElement("div", { className: "text-right text-gray-400 text-xs mt-2" },
            "$",
            amount > 0 ? toPrecision(stakedUsdValue, 4) : '—')));
}
