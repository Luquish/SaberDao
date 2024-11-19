import { useSail } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useLocation, navigate } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";

import { useSDK } from "@/contexts/sdk";
import { useSmartWalletAddress } from "@/hooks/tribeca/useSmartWalletAddress";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { handleException } from "@/utils/tribeca/error";
import { notify } from "@/utils/tribeca/notifications";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { Button } from "@/components/tribeca/common/Button";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { getUrlParams } from "@/utils/tribeca/urlParams";

const DAOStep3EmergencyView: React.FC = () => {
  const location = useLocation();
  const executive = getUrlParams.governor(location.pathname);

  const [baseKP, setBaseKP] = useState<Keypair>(Keypair.generate());
  const { data: smartWalletKey } = useSmartWalletAddress(baseKP.publicKey);
  const { sdkMut } = useSDK();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  return (
    <div className="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div className="mb-8">
          <h1 className="font-bold text-2xl mb-4 dark:text-gray-50">
            Create the Emergency Multisig
          </h1>
        </div>
        <div className="flex flex-col items-center gap-16">
          <div className="prose prose-sm dark:prose-light">
            <p>
              The Emergency Multisig is intended to be used for occasions where
              trusted parties determine one should bypass governance.
            </p>
            <p>
              For now, we'll add your wallet to the Emergency Multisig. You will
              want to add other members, e.g. other protocols or developers in
              the space that are well known and trusted, in the future.
            </p>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-xs mb-1.5">Emergency Multisig Address</span>
            <div className="flex gap-2 w-full">
              <InputText
                className="h-10 flex-grow"
                disabled
                value={smartWalletKey?.toString()}
              />
              <Button
                className="flex items-center gap-2 h-10"
                onClick={() => {
                  setBaseKP(Keypair.generate());
                }}
              >
                <span>Reroll</span>
                <FaDice />
              </Button>
            </div>
          </div>
          <div>
            <AsyncButton
              size="md"
              variant="primary"
              disabled={!executive}
              onClick={async () => {
                invariant(executive, "executive");
                try {
                  invariant(sdkMut, "sdk");
                  const { tx, smartWalletWrapper } =
                    await sdkMut.newSmartWallet({
                      owners: [sdkMut.provider.wallet.publicKey],
                      threshold: new BN(1),
                      // default to 11 max owners
                      // if people complain about cost, we can reduce this
                      numOwners: 11,
                      base: baseKP,
                    });
                  notify({
                    message: "Creating the Emergency Multisig",
                    description:
                      "Please sign the transaction in your wallet to continue.",
                  });
                  const { pending, success } = await handleTX(
                    await wrapTx(tx),
                    "Create Emergency Multisig"
                  );
                  if (!success || !pending) {
                    return;
                  }
                  await pending.wait({ commitment: "confirmed" });

                  notify({
                    message: `Wallet created successfully`,
                    description: smartWalletWrapper.key.toString(),
                  });
                  void navigate(
                    `/tribeca/onboarding/dao/create-dao?executive=${executive.toString()}&emergency=${smartWalletWrapper.key.toString()}`
                  );
                } catch (e) {
                  handleException(e, {
                    source: "create-multisig",
                  });
                }
              }}
            >
              Create Emergency Multisig
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAOStep3EmergencyView;
