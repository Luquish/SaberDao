import React from 'react';
import H2 from '../H2';
import Input, { InputType } from '../Input';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import useStake from '../../hooks/user/useStake';
import { useMutation } from '@tanstack/react-query';
import useUserGetLPTokenBalance from '../../hooks/user/useGetLPTokenBalance';
import useQuarryMiner from '../../hooks/user/useQuarryMiner';
export default function StakeForm(props) {
    const { register, watch, setValue } = useForm();
    const { stake } = useStake(props.pool);
    const { refetch } = useQuarryMiner(props.pool.info.lpToken, true);
    const { data: balance, refetch: refetchLP } = useUserGetLPTokenBalance(props.pool.pair.pool.state.poolTokenMint.toString());
    const { mutate: execStake, isPending, isSuccess, data: hash } = useMutation({
        mutationKey: ['stake'],
        mutationFn: async (amount) => {
            if (!amount) {
                return null;
            }
            await stake(amount);
            refetch();
            refetchLP();
        },
    });
    const amount = watch('amount');
    return (React.createElement("div", { className: "w-full", onClick: () => {
        } },
        React.createElement(H2, null, "Stake"),
        React.createElement("p", { className: "text-secondary text-sm" }, "Stake LP tokens to receive farm rewards."),
        React.createElement(Input, { align: "right", register: register('amount'), type: InputType.NUMBER, placeholder: "0.00", size: "full" }),
        React.createElement("div", { className: "text-white text-xs text-right my-5" },
            "Balance:",
            ' ',
            React.createElement("div", { className: "text-saber-light cursor-pointer inline", onClick: () => setValue('amount', balance?.balance.value.uiAmount ?? 0) }, balance?.balance.value.uiAmount)),
        isPending
            ? React.createElement(Button, { disabled: true, size: "full" }, "Staking...")
            : React.createElement(Button, { size: "full", onClick: () => execStake(amount), disabled: !amount }, "Stake")));
}
