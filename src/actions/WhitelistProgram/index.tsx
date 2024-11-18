import { usePubkey } from "@rockooor/sail";
import { buildStubbedTransaction } from "@saberhq/solana-contrib";
import { SystemProgram } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { findWhitelistAddress, TRIBECA_CODERS } from "@tribecahq/tribeca-sdk";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { LabeledInput } from "@/components/tribeca/common/inputs/LabeledInput";
import { serializeToBase64 } from "@/utils/tribeca/makeTransaction";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import type { ActionFormProps } from "../types";
import React from "react";

export const WhitelistProgram: React.FC<ActionFormProps> = ({
  actor,
  ctx,
  payer,
  setTxRaw,
}: ActionFormProps) => {
  const lockerKey = ctx?.locker;
  const governorKey = ctx?.governor;
  invariant(lockerKey && governorKey);

  const { network } = useEnvironment();
  invariant(network !== "localnet");

  const [programStr, setProgramStr] = useState<string>("");

  const programID = usePubkey(programStr);

  const { data: whitelistEntryKey } = useQuery({
    queryKey: ["whitelistEntryKey", programID?.toString()],
    queryFn: async () => {
      if (!programID) {
        return null;
      }
      const [whitelistEntry] = await findWhitelistAddress(
        lockerKey,
        programID,
        null
      );
      return whitelistEntry;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!programID || !whitelistEntryKey) {
      return;
    }
    void (async () => {
      const [whitelistEntry, bump] = await findWhitelistAddress(
        lockerKey,
        programID,
        null
      );
      const ix = TRIBECA_CODERS.LockedVoter.encodeIX(
        "approveProgramLockPrivilege",
        {
          bump,
        },
        {
          locker: lockerKey,
          whitelistEntry,
          governor: governorKey,
          smartWallet: actor,
          payer,
          systemProgram: SystemProgram.programId,
          executableId: programID,
          whitelistedOwner: SystemProgram.programId,
        }
      );
      const fakeTX = buildStubbedTransaction(network, [ix]);
      setTxRaw(serializeToBase64(fakeTX));
    })();
  }, [
    actor,
    governorKey,
    lockerKey,
    network,
    payer,
    programID,
    setTxRaw,
    whitelistEntryKey,
  ]);

  return (
    <>
      <LabeledInput
        Component={InputText}
        id="program"
        label="Program ID"
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProgramStr(e.target.value)
        }
      />
    </>
  );
};
