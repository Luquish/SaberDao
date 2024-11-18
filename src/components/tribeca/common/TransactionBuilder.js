import React, { useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button } from './Button';
import { notify } from '../../../utils/tribeca/notifications';
export const TransactionBuilder = () => {
    const [rawTx, setRawTx] = useState('');
    const { connection } = useConnection();
    const wallet = useWallet();
    const handleSubmit = async (e) => {
        try {
            if (!wallet.publicKey || !wallet.signTransaction) {
                notify({
                    type: 'error',
                    message: 'Wallet not connected!'
                });
                return;
            }
            const buffer = Buffer.from(rawTx, 'base64');
            const transaction = Transaction.from(buffer);
            transaction.feePayer = wallet.publicKey;
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            const signedTx = await wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTx.serialize());
            notify({
                type: 'success',
                message: 'Transaction sent',
                description: signature,
            });
        }
        catch (error) {
            notify({
                type: 'error',
                message: 'Error sending transaction',
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
    return (React.createElement("div", { className: "max-w-2xl mx-auto p-6" },
        React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Transaction Builder"),
        React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement("textarea", { className: "w-full h-32 p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700", placeholder: "Paste base64 encoded transaction...", value: rawTx, onChange: (e) => setRawTx(e.target.value) }),
            React.createElement(Button, { onClick: handleSubmit, disabled: !wallet.connected || !rawTx, variant: "primary", size: "md" }, "Send Transaction"))));
};
