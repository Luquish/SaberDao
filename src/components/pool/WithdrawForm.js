// src/components/pool/WithdrawForm.tsx
import React from 'react';
import H2 from '../H2';
import Input, { InputType } from '../Input';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import { useMutation } from '@tanstack/react-query';
import useUserGetLPTokenBalance from '../../hooks/user/useGetLPTokenBalance';
import { useWithdraw } from '../../hooks/user/useWithdraw';
import { Token, TokenAmount } from '@saberhq/token-utils';
import { useStableSwapTokens } from '../../hooks/useStableSwapTokens';
import useQuarryMiner from '../../hooks/user/useQuarryMiner';
export default function WithdrawForm(props) {
    const { register, watch, setValue } = useForm();
    const { refetch } = useQuarryMiner(props.pool.info.lpToken, true);
    const { data: balance, refetch: refetchLP } = useUserGetLPTokenBalance(props.pool.pair.pool.state.poolTokenMint.toString());
    const tokens = useStableSwapTokens(props.pool);
    const amount = watch('amount');
    const withdraw = useWithdraw({
        withdrawPoolTokenAmount: TokenAmount.parse(new Token(props.pool.info.lpToken), amount ? `${amount}` : '0'),
        withdrawToken: undefined, // Always do a balanced withdraw. We can optionally later swap to one using Jup for better price
        wrappedTokens: tokens?.wrappedTokens,
        pool: props.pool,
        actions: {
            withdraw: true,
            unstake: false,
        },
    });
    const { mutate: execWithdraw, isPending, isSuccess, data: hash } = useMutation({
        mutationKey: ['withdraw'],
        mutationFn: async () => {
            if (!amount) {
                return;
            }
            await withdraw?.handleWithdraw();
            refetch();
            refetchLP();
        },
    });
    return (React.createElement("div", { className: "w-full" },
        React.createElement(H2, null, "Withdraw"),
        React.createElement("p", { className: "text-secondary text-sm" }, "Withdraw LP tokens to receive the underlying tokens."),
        React.createElement(Input, { align: "right", register: register('amount'), type: InputType.NUMBER, placeholder: "0.00", size: "full" }),
        React.createElement("div", { className: "text-white text-xs text-right my-5" },
            "Balance:",
            ' ',
            React.createElement("div", { className: "text-saber-light cursor-pointer inline", onClick: () => setValue('amount', balance?.balance.value.uiAmount ?? 0) }, balance?.balance.value.uiAmount)),
        isPending
            ? React.createElement(Button, { disabled: true, size: "full" }, "Withdrawing...")
            : React.createElement(Button, { size: "full", onClick: () => execWithdraw(), disabled: !amount }, "Withdraw")));
}
