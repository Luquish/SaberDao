import { useSail } from "@rockooor/sail";
import { Saber } from "@saberhq/saber-periphery";
import type { u64 } from "@saberhq/token-utils";
import { getOrCreateATA, TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import { LAMPORTS_PER_SOL, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import invariant from "tiny-invariant";
import React, { Provider } from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { Button } from "@/components/tribeca/common/Button";

const SaberLockupInner: React.FC = () => {
  const { key, smartWallet } = useSmartWallet();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  //   const { data: release } = useQuery(
  //     ["saberLockup", key.toString()],
  //     async () => {
  //       const saber = Saber.load({ provider: sdk.provider });
  //       return await saber.lockup.fetchRelease(key);
  //     }
  //   );

  const withdraw = async (amount?: u64) => {
    invariant(smartWallet);
    const saber = Saber.load({ provider: smartWallet.provider });

    const mintProxyState = await saber.mintProxy.program.state.fetch();
    const mintProxyStateAddress = saber.mintProxy.program.state.address();

    const { address, instruction } = await getOrCreateATA({
      provider: saber.provider as any,
      mint: mintProxyState.tokenMint,
      owner: saber.provider.wallet.publicKey,
    });
    if (instruction) {
      const { pending, success } = await handleTX(
        await wrapTx(saber.provider.newTX([instruction])),
        "Create SBR ATA"
      );
      if (!pending || !success) {
        return;
      }
      await pending.wait();
    }

    const releaseKey = await saber.lockup.releaseAddress(key);
    const accounts = {
      proxyMintAuthority: mintProxyState.proxyMintAuthority,
      tokenMint: mintProxyState.tokenMint,
      beneficiary: key,
      release: releaseKey,
      tokenAccount: address,
      tokenProgram: TOKEN_PROGRAM_ID,
      unusedClock: SYSVAR_CLOCK_PUBKEY,
      minterInfo: await saber.mintProxy.getMinterInfoAddress(releaseKey),
      mintProxyState: mintProxyStateAddress,
      mintProxyProgram: saber.programs.MintProxy.programId,
    };

    const { tx: newTX } = await smartWallet.newTransaction({
      instructions: [
        amount
          ? saber.programs.Lockup.state.instruction.withdrawWithAmount(amount, {
              accounts,
            })
          : saber.programs.Lockup.state.instruction.withdraw({
              accounts,
            }),
      ],
    });
    const { pending, success } = await handleTX(
      await wrapTx(newTX),
      "New transaction"
    );
    if (!pending || !success) {
      return;
    }
    await pending.wait();
  };

  return (
    <div>
      <Button
        disabled={!smartWallet}
        variant="primary"
        onClick={async () => {
          await withdraw();
        }}
      >
        Withdraw All
      </Button>
      <AsyncButton
        variant="primary"
        onClick={async (sdkMut) => {
          await (await sdkMut.provider.requestAirdrop(LAMPORTS_PER_SOL)).wait();
        }}
      >
        Airdrop
      </AsyncButton>
    </div>
  );
};

export default SaberLockupInner;
