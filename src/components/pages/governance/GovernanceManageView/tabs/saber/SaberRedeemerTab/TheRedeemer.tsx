import { usePubkey } from "@rockooor/sail";
import React from "react";
import { useParams } from "react-router-dom";

import { AttributeList } from "../../../../../../common/AttributeList";
import { Card } from "../../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../../common/LoadingPage";
import { InitializeRedeemer } from "./InitializeRedeemer";
import { RedeemerAllowance } from "./RedeemerAllowance";
import { useRedeemer } from "./useRedeemer";

export const TheRedeemer: React.FC = () => {
  const { iouMint: iouMintString } = useParams<{ iouMint: string }>();
  const iouMint = usePubkey(iouMintString);
  const { data: redeemer } = useRedeemer(iouMint ?? undefined);

  if (redeemer === undefined) {
    return <LoadingPage />;
  }

  return (
    <div tw="flex flex-col gap-4">
      {redeemer === null ? (
        <InitializeRedeemer iouMint={iouMint ?? undefined} />
      ) : (
        <>
          <Card title="Redeemer">
            <AttributeList
              loading={redeemer === undefined}
              attributes={{
                Key: redeemer?.publicKey,
                "IOU Mint": redeemer?.account.iouMint,
                "Redemption Mint": redeemer?.account.redemptionMint,
                "Redemption Vault": redeemer?.account.redemptionVault,
              }}
            />
          </Card>
          <RedeemerAllowance redeemer={redeemer.publicKey} />
        </>
      )}
    </div>
  );
};
