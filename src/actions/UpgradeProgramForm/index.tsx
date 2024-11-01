import type { Transaction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { GiTumbleweed } from "react-icons/gi";

import { AddressLink } from "../../components/common/AddressLink";
import { EmptyState } from "../../components/common/EmptyState";
import { NoPrograms } from "../../components/common/governance/NoPrograms";
import { Select } from "../../components/common/inputs/InputText";
import { LoadingPage } from "../../components/common/LoadingPage";
import { useSDK } from "../../contexts/sdk";
import { useGovernor } from "../../hooks/tribeca/useGovernor";
import {
  useAuthorityBuffers,
  useAuthorityPrograms,
} from "../../hooks/useAuthorityPrograms";
import { createUpgradeInstruction } from "../../utils/instructions/upgradeable_loader/instructions";
import { makeTransaction } from "../../utils/makeTransaction";
import { programLabel } from "../../utils/programs";
import { useEnvironment } from "../../utils/useEnvironment";
import { shortenAddress } from "../../utils/utils";
import { BufferOption } from "./BufferOption";

interface Props {
  onSelect: (tx: Transaction) => void;
}

export const UpgradeProgramForm: React.FC<Props> = ({ onSelect }: Props) => {
  const { sdkMut } = useSDK();
  const { smartWallet } = useGovernor();
  const { data: buffers } = useAuthorityBuffers(smartWallet);
  const { programs, programData } = useAuthorityPrograms(smartWallet);
  const { network } = useEnvironment();

  const [programID, setProgramID] = useState<string | null>(null);
  const [bufferKey, setBufferKey] = useState<string | null>(null);

  useEffect(() => {
    if (!programID || !bufferKey || !sdkMut || !smartWallet) {
      return;
    }
    void (async () => {
      const ix = await createUpgradeInstruction({
        program: new PublicKey(programID),
        buffer: new PublicKey(bufferKey),
        spill: sdkMut.provider.wallet.publicKey,
        signer: smartWallet,
      });
      onSelect(makeTransaction(network, [ix]));
    })();
  }, [programID, bufferKey, network, sdkMut, onSelect, smartWallet]);

  return (
    <>
      <label tw="flex flex-col gap-1" htmlFor="upgradeBuffer">
        <span tw="text-sm">Program ID</span>
        {smartWallet ? (
          <>
            {programs?.length === 0 && !programData.isLoading ? (
              <NoPrograms smartWallet={smartWallet} />
            ) : (
              <Select
                onChange={(e) => {
                  setProgramID(e.target.value);
                }}
              >
                <option>Select a program ID</option>
                {programs?.map((program) => {
                  const { data } = program;
                  if (!data) {
                    return null;
                  }
                  const programIDStr = data.programID.toString();
                  const label = programLabel(programIDStr);
                  return (
                    <option key={programIDStr} value={programIDStr}>
                      {label
                        ? `${label} (${shortenAddress(programIDStr, 3)})`
                        : shortenAddress(programIDStr, 10)}
                    </option>
                  );
                })}
              </Select>
            )}
          </>
        ) : (
          <LoadingPage />
        )}
      </label>
      <label tw="flex flex-col gap-1" htmlFor="upgradeBuffer">
        <span tw="text-sm">New Buffer</span>
        {smartWallet ? (
          <>
            {buffers?.length === 0 ? (
              <EmptyState icon={<GiTumbleweed />} title="No buffers available">
                <p>
                  To propose a program upgrade, please upload a buffer with the
                  <br />
                  upgrade authority{" "}
                  <AddressLink address={smartWallet} showCopy /> by following{" "}
                  <a
                    tw="text-primary"
                    href="https://github.com/gokiprotocol/goki-cli"
                    target="_blank"
                    rel="noreferrer"
                  >
                    these instructions
                  </a>
                  .
                </p>
              </EmptyState>
            ) : (
              <Select
                onChange={(e) => {
                  setBufferKey(e.target.value);
                }}
              >
                <option>Select a buffer</option>
                {buffers?.map((buffer) => (
                  <BufferOption
                    key={buffer.pubkey.toString()}
                    buffer={buffer}
                  />
                ))}
              </Select>
            )}
          </>
        ) : (
          <LoadingPage />
        )}
      </label>
    </>
  );
};
