import React, { useEffect } from 'react';
import Button from '../Button';
import { useLocalStorage } from 'usehooks-ts';
import Input, { InputType } from '../Input';
import { useForm } from 'react-hook-form';
const RPCForm = () => {
    const [storedRpc, setStoredRpc] = useLocalStorage('rpc', '');
    const { register, watch, setValue } = useForm();
    const rpc = watch('rpc');
    useEffect(() => {
        if (rpc?.startsWith('https://')) {
            return setStoredRpc(rpc);
        }
        setStoredRpc('');
    }, [rpc]);
    return (React.createElement("div", { className: "flex gap-2 mt-4" },
        React.createElement(Button, { type: !rpc ? 'primary' : 'secondary', onClick: () => setValue('rpc', '') }, "Triton"),
        React.createElement(Input, { type: InputType.TEXT, register: register('rpc'), placeholder: "Custom...", defaultValue: storedRpc })));
};
export default function SettingModel() {
    const [priorityFee, setPriorityFee] = useLocalStorage('priorityFee', 0.0001);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "mt-3" },
            React.createElement("p", { className: "font-bold" }, "Priority fee"),
            React.createElement("div", { className: "flex gap-2 mt-4" },
                React.createElement(Button, { type: priorityFee === 0 ? 'primary' : 'secondary', onClick: () => setPriorityFee(0) }, "None"),
                React.createElement(Button, { type: priorityFee === 0.0001 ? 'primary' : 'secondary', onClick: () => setPriorityFee(0.0001) }, "0.0001 SOL"),
                React.createElement(Button, { type: priorityFee === 0.001 ? 'primary' : 'secondary', onClick: () => setPriorityFee(0.001) }, "0.001 SOL"),
                React.createElement(Button, { type: priorityFee === 0.01 ? 'primary' : 'secondary', onClick: () => setPriorityFee(0.01) }, "0.01 SOL"))),
        React.createElement("div", { className: "mt-3" },
            React.createElement("p", { className: "font-bold" }, "RPC endpoint"),
            React.createElement(RPCForm, null))));
}
