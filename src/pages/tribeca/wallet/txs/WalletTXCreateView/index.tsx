import { AnchorProvider, Program } from "@project-serum/anchor";
import type { IdlInstruction } from "@project-serum/anchor/dist/esm/idl";
import { SignerWallet } from "@saberhq/solana-contrib";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import React from "react";

import { useProgramIndex } from "@/hooks/tribeca/deploydao/useProgramIndex";
import { useIDL } from "@/hooks/tribeca/useIDLs";
import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { Select } from "@/components/tribeca/common/inputs/InputText";
import BasicPage from "@/components/tribeca/common/page/BasicPage";
import IXForm from "./IXForm";

export type InstructionInfo = {
  type: "instruction" | "method";
  instruction: IdlInstruction;
};

const WalletTXCreateView: React.FC = () => {
  const { connection } = useConnection();
  const { smartWallet } = useSmartWallet();
  const [programID, setProgramID] = useState<PublicKey | null>(null);
  const [ix, setIx] = useState<InstructionInfo | null>(null);

  const { data: index } = useProgramIndex();
  const { data: idlData } = useIDL(programID);
  const idl = idlData?.idl;

  const ixs = useMemo((): InstructionInfo[] | null | undefined => {
    if (!idl) {
      return idl;
    }
    const methods = (idl?.state?.methods ?? []).map((ix: any) => ({
      type: "method" as const,
      instruction: ix,
    }));
    const instructions = (idl?.instructions ?? []).map((ix: any) => ({
      type: "instruction" as const,
      instruction: ix,
    }));
    return [...methods, ...instructions];
  }, [idl]);

  const program = useMemo(() => {
    if (idl && programID) {
      const provider = new AnchorProvider(
        connection,
        new SignerWallet(Keypair.generate()),
        AnchorProvider.defaultOptions()
      );
      return new Program(idl, programID, provider);
    }
    return null;
  }, [connection, idl, programID]);

  useEffect(() => {
    setIx(ixs?.[0] ?? null);
  }, [ixs]);

  return (
    <BasicPage
      title="Propose a Transaction"
      description="Interact with any Anchor program."
    >
      <form className="grid gap-4">
        <div className="p-4 border grid gap-4">
          <label className="grid gap-1">
            <span>Program</span>
            <Select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setProgramID(
                  e.target.value ? new PublicKey(e.target.value) : null
                );
              }}
            >
              <option key="" value="">
                {index ? "Select a program" : "Loading..."}
              </option>
              {index
                ? index.map(({ label, address }) => {
                    return (
                      <option
                        key={address.toString()}
                        value={address.toString()}
                      >
                        {`${label} (${address.toString()})`}
                      </option>
                    );
                  })
                : null}
            </Select>
          </label>
          {programID && (
            <label className="grid gap-1">
              <span>Instruction</span>
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const [ixType, ixName] = e.target.value.split("_");
                  const theIX = ixs?.find(
                    (ix) => ix.type === ixType && ix.instruction.name === ixName
                  );
                  setIx(theIX ?? null);
                }}
              >
                {ixs
                  ? ixs.map((ix) => {
                      return (
                        <option
                          key={`${ix.type}_${ix.instruction.name}`}
                          value={`${ix.type}_${ix.instruction.name}`}
                        >
                          {ix.type === "method" ? `${idl?.name ?? ""}#` : ""}
                          {ix.instruction.name}
                        </option>
                      );
                    })
                  : null}
              </Select>
            </label>
          )}
        </div>
        {ix && program && (
          <div className="p-4 border">
            <IXForm
              key={`${program.programId.toString()}_${ix.type}_${
                ix.instruction.name
              }`}
              ix={ix}
              types={idl?.types}
              program={program}
              smartWallet={smartWallet}
            />
          </div>
        )}
      </form>
    </BasicPage>
  );
};

export default WalletTXCreateView;
