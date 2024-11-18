import { TransactionEnvelope } from '@saberhq/solana-contrib';
import { getATAAddress, getOrCreateATA, SPLToken, TOKEN_PROGRAM_ID, TokenAccountLayout, } from '@saberhq/token-utils';
import { NATIVE_MINT } from '@solana/spl-token';
import { Keypair, SystemProgram } from '@solana/web3.js';
/**
 * Here we:
 * 1. init the account via system program, and fund it with `amount` + `rent`
 * 2. initialize the token account
 *
 * And we also return another instruction to close the account & send lamports back to the user.
 */
export const createEphemeralWrappedSolAccount = async ({ provider, amount, accountKP = Keypair.generate(), owner = provider.wallet.publicKey, }) => {
    // Allocate memory for the account
    const balanceNeeded = await SPLToken.getMinBalanceRentForExemptAccount(provider.connection);
    const solBalance = amount.toU64().toNumber();
    const payer = provider.wallet.publicKey;
    const payerBalance = await provider.connection.getBalance(payer);
    if (payerBalance < balanceNeeded) {
        throw new Error(`Insufficient SOL balance: payerBalance: ${payerBalance} < balanceNeeded: ${balanceNeeded}`);
    }
    const initAccountInstructions = [
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: accountKP.publicKey,
            lamports: balanceNeeded + solBalance,
            space: TokenAccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
        }),
        SPLToken.createInitAccountInstruction(TOKEN_PROGRAM_ID, NATIVE_MINT, accountKP.publicKey, owner),
    ];
    return {
        accountKey: accountKP.publicKey,
        init: new TransactionEnvelope(provider, initAccountInstructions, [
            accountKP,
        ]),
        close: new TransactionEnvelope(provider, [
            SPLToken.createCloseAccountInstruction(TOKEN_PROGRAM_ID, accountKP.publicKey, payer, owner, []),
        ]),
    };
};
export const wrapAndSendSOLToATA = async ({ provider, amount, accountKP = Keypair.generate(), owner = provider.wallet.publicKey, }) => {
    const { init, accountKey, close } = await createEphemeralWrappedSolAccount({
        provider,
        amount,
        accountKP,
        owner,
    });
    const { instruction: createInstruction, address } = await getOrCreateATA({
        provider,
        mint: NATIVE_MINT,
        owner,
    });
    if (createInstruction) {
        init.instructions.unshift(createInstruction);
    }
    init.instructions.push(SPLToken.createTransferInstruction(TOKEN_PROGRAM_ID, accountKey, address, owner, [], amount.toU64()));
    return init.combine(close);
};
export const closeWrappedAccount = async (provider, owner) => {
    const wrappedAccount = await getATAAddress({ mint: NATIVE_MINT, owner });
    return new TransactionEnvelope(provider, [
        SPLToken.createCloseAccountInstruction(TOKEN_PROGRAM_ID, wrappedAccount, owner, owner, []),
    ]);
};
