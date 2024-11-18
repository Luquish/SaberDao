import React from 'react';
import invariant from 'tiny-invariant';
import { ComputeBudgetProgram, LAMPORTS_PER_SOL, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import TX from '../components/TX';
import { toast } from 'sonner';
const getCUsForTx = async (connection, latestBlockhash, txs, payerKey) => {
    const messageV0 = new TransactionMessage({
        payerKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: txs,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    const simulation = await connection.simulateTransaction(transaction);
    // Add 25K + 10% leeway here because the simulation of a stake right after deposit takes some time (>10-20 secs) to update to the correct
    // number of CUs used (and maybe other TXs as well). Just 10% is not enough for very low CU TXs (like quarry stake).
    const CUs = simulation.value.unitsConsumed ? Math.ceil(1.1 * simulation.value.unitsConsumed + 75000) : 1.4e6;
    return CUs;
};
export const createVersionedTransaction = async (connection, txs, signers, payerKey, minCU = 0) => {
    const latestBlockhash = await connection.getLatestBlockhash('finalized');
    const CUs = Math.max(minCU, await getCUsForTx(connection, latestBlockhash, txs, payerKey));
    console.log(CUs);
    const priorityFeeLS = localStorage.getItem('priorityFee') ? parseFloat(localStorage.getItem('priorityFee')) : undefined;
    const priorityFee = (priorityFeeLS ?? 0.0001) * LAMPORTS_PER_SOL * 1e6;
    console.log('x', priorityFee);
    txs.unshift(ComputeBudgetProgram.setComputeUnitLimit({
        units: CUs,
    }));
    txs.unshift(ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.ceil(priorityFee / (CUs)),
    }));
    const messageV0 = new TransactionMessage({
        payerKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: txs,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign(signers);
    console.log(Buffer.from(transaction.serialize()).toString('base64'));
    return { transaction, latestBlockhash };
};
export const sendTransaction = async (connection, txs, signers, wallet, onSuccess) => {
    if (!wallet.adapter.publicKey) {
        return 'No wallet connected';
    }
    const vt = await createVersionedTransaction(connection, txs, signers, wallet.adapter.publicKey);
    const hash = await wallet.adapter.sendTransaction(vt.transaction, connection);
    await connection.confirmTransaction({ signature: hash, ...vt.latestBlockhash }, 'finalized');
    // Add toast
    onSuccess?.(hash);
    if (hash) {
        return hash;
    }
    return 'Transaction failed';
};
export const executeMultipleTxs = async (connection, txs, wallet) => {
    invariant(wallet.adapter.publicKey);
    for (let i = 0; i < txs.length; i++) {
        const tx = sendTransaction(connection, txs[i].txs, txs[i].signers ?? [], wallet);
        toast.promise(tx, {
            loading: `(${i + 1} / ${txs.length}) ${txs[i].description}`,
            success: (data) => React.createElement("div", { className: "text-sm" },
                React.createElement("p", null, "Transaction successful! Your transaction hash:"),
                React.createElement(TX, { tx: data }))
        });
        await tx;
    }
};
