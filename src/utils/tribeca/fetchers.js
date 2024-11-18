import { Program } from "@project-serum/anchor";
import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { makeAnchorProvider } from "@saberhq/anchor-contrib";
import { SignerWallet, SolanaProvider } from "@saberhq/solana-contrib";
import { Keypair, PublicKey } from "@solana/web3.js";
export const fetchIDL = async (connection, address) => {
    const response = await fetchNullableWithSessionCache(`https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/idls/${address}.json`);
    if (response === null) {
        return await Program.fetchIdl(new PublicKey(address), makeAnchorProvider(SolanaProvider.init({
            connection,
            wallet: new SignerWallet(Keypair.generate()),
        })));
    }
    return response;
};
