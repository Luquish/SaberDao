import React, { useState } from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { NamedAddressLink } from "@/components/tribeca/common/account/NamedAddressLink";
import { Button } from "@/components/tribeca/common/Button";
import { AddSignerModal } from "./AddSignerModal";
import { UpdateThresholdModal } from "./UpdateThresholdModal";

enum SignerModal {
  UpdateThreshold,
  AddSigner,
}

export const SignersSection: React.FC = () => {
  const { smartWalletData } = useSmartWallet();
  const threshold = smartWalletData?.account?.threshold.toNumber();

  const [signerModal, setSignerModal] = useState<SignerModal | null>(null);

  return (
    <div>
      <UpdateThresholdModal
        isOpen={signerModal === SignerModal.UpdateThreshold}
        onDismiss={() => {
          setSignerModal(null);
        }}
      />
      <AddSignerModal
        isOpen={signerModal === SignerModal.AddSigner}
        onDismiss={() => {
          setSignerModal(null);
        }}
      />
      <h2 className="text-xl font-medium mb-1">Signers</h2>
      <p className="text-secondary text-sm">
        A proposed transaction may only be executed if {threshold} of these
        addresses approve it.
      </p>
      <div className="my-6 flex items-center gap-4">
        <Button
          variant="primary"
          onClick={() => {
            setSignerModal(SignerModal.UpdateThreshold);
          }}
        >
          Update Minimum Signers Threshold
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setSignerModal(SignerModal.AddSigner);
          }}
        >
          Add a signer
        </Button>
      </div>
      <div className="text-sm">
        {smartWalletData?.account?.owners.map((owner, i) => {
          return (
            <div
              key={`owner_${i}`}
              className="h-11 flex items-center justify-between border-b px-2"
            >
              <NamedAddressLink address={owner} showCopy />
              <Button variant="outline" size="sm" className="text-xs h-7">
                Remove
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
