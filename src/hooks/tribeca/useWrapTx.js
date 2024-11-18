import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { ComputeBudgetProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
const getCUsForTx = async (txEnv) => {
    const simulation = await txEnv.simulate({ verifySigners: false });
    console.log(simulation);
    // Add 25K + 10% leeway here because simulations are not 100% accurate
    const CUs = simulation.value.unitsConsumed
        ? Math.ceil(1.1 * simulation.value.unitsConsumed + 25000)
        : 1.4e6;
    return CUs;
};
const prependPriofeeAndCU = async (tx) => {
    const CUs = await getCUsForTx(tx);
    const priorityFeeLS = parseFloat(localStorage.getItem("priorityFee") ?? "");
    const priorityFee = (priorityFeeLS || 0) * LAMPORTS_PER_SOL * 1e6;
    // Don't add twice
    if (tx.instructions[0]?.programId === ComputeBudgetProgram.programId) {
        return tx;
    }
    tx.prepend(ComputeBudgetProgram.setComputeUnitLimit({
        units: CUs,
    }));
    if (priorityFee > 0) {
        tx.prepend(ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: Math.ceil(priorityFee / CUs),
        }));
    }
    return tx;
};
export const useWrapTx = () => {
    const wrapTx = async (txEnv) => {
        if (Array.isArray(txEnv)) {
            return Promise.all(txEnv.map((t) => prependPriofeeAndCU(t)));
        }
        if (txEnv instanceof TransactionEnvelope) {
            return prependPriofeeAndCU(txEnv);
        }
        throw Error("Invalid txEnv");
    };
    return { wrapTx };
};
