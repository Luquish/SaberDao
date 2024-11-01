import { AnchorProvider, Program } from "@project-serum/anchor";
import { SignerWallet } from "@saberhq/solana-contrib";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

import { useProgramIndex } from "../../../hooks/deploydao/useProgramIndex";
import { useIDL } from "../../../hooks/useIDLs";
import type { InstructionInfo } from "../../pages/wallet/txs/WalletTXCreateView";
import { IXForm } from "../../pages/wallet/txs/WalletTXCreateView/IXForm";
import { Select } from "../inputs/InputText";

export const TransactionBuilder: React.FC = () => {
  const { connection } = useConnection();
  const [programID, setProgramID] = useState<PublicKey | null>(null);
  const [ix, setIx] = useState<InstructionInfo | null>(null);

  const { data: index } = useProgramIndex();
  const { data: idlData } = useIDL(programID);
  const idl = idlData?.idl;

  const ixs = useMemo((): InstructionInfo[] | null | undefined => {
    if (!idl) {
      return idl;
    }
    const methods = (idl?.state?.methods ?? []).map((ix) => ({
      type: "method" as const,
      instruction: ix,
    }));
    const instructions = (idl?.instructions ?? []).map((ix) => ({
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
    <form tw="grid gap-4">
      <div tw="p-4 border grid gap-4">
        <label tw="grid gap-1">
          <span>Program</span>
          <Select
            onChange={(e) => {
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
                    <option key={address.toString()} value={address.toString()}>
                      {`${label} (${address.toString()})`}
                    </option>
                  );
                })
              : null}
          </Select>
        </label>
        {programID && (
          <label tw="grid gap-1">
            <span>Instruction</span>
            <Select
              onChange={(e) => {
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
        <div tw="p-4 border">
          <IXForm
            key={`${program.programId.toString()}_${ix.type}_${
              ix.instruction.name
            }`}
            types={idl?.types}
            ix={ix}
            program={program}
          />
        </div>
      )}
    </form>
  );
};
