import { RouteComponentProps } from '@reach/router';
import { useSail } from "@rockooor/sail";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import invariant from "tiny-invariant";
import React from "react";

import { useAuthorityPrograms } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/tribeca/useWrapTx";
import {
  createSetAuthorityInstruction,
  findProgramDataAddress,
} from "../../../../../utils/tribeca/instructions/upgradeable_loader/instructions";
import { displayAddress } from "../../../../../utils/tribeca/programs";
import { AsyncButton } from "../../../../../components/tribeca/common/AsyncButton";
import {
  EmptyState,
  EmptyStateConnectWallet,
} from "../../../../../components/tribeca/common/EmptyState";
import { ErrorMessage } from "../../../../../components/tribeca/common/ErrorMessage";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { LoadingSpinner } from "../../../../../components/tribeca/common/LoadingSpinner";
import { Notice } from "../../../../../components/tribeca/common/Notice";
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { ReactComponent as EmptyFolder } from "../../../../../components/tribeca/common/svgs/EmptyFolder.svg";
import { ProgramCard } from "../WalletProgramsView/ProgramCard";

export const ProgramImportView: React.FC<RouteComponentProps> = () => {
    const wallet = useAnchorWallet();
    const { key } = useSmartWallet();
    const { programs, programData } = useAuthorityPrograms(wallet?.publicKey);
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    
    return (
      <BasicPage
        title="Import a Program"
        description="Transfer the upgrade authority of one of your programs to your Smart Wallet."
      >
        {!wallet && (
          <EmptyStateConnectWallet title="Connect your wallet to import a program." />
        )}
        {programData.isLoading ? (
          <LoadingPage />
        ) : (
          programs.length === 0 &&
          programData.data?.map((pdata) => (
            <Notice key={pdata.pubkey.toString()}>
              <LoadingSpinner />
            </Notice>
          ))
        )}
        {programs.length === 0 && programData.isFetched && (
          <EmptyState
            icon={<EmptyFolder />}
            title="Your connected wallet doesn't own any programs."
          >
            <div className="text-secondary flex flex-col items-center gap-2 mt-4">
              <p>
                You must connect to the upgrade authority wallet in order to
                import programs.
              </p>
              <p>
                Haven't deployed yet?{" "}
                <a
                  className="text-primary"
                  href="https://docs.solana.com/cli/deploy-a-program"
                  target="_blank"
                  rel="noreferrer"
                >
                  View the official guide
                </a>
              </p>
            </div>
          </EmptyState>
        )}
        <div className="flex flex-col gap-2">
          {programs.map((program, i) => {
            return (
              <div key={program.data?.programID.toString() ?? `loading_${i}`}>
                {program.isLoading && <LoadingSpinner />}
                {program.isError && <ErrorMessage error={program.error} />}
                {program.data && (
                  <ProgramCard
                    program={program.data}
                    actions={
                      <AsyncButton
                        onClick={async (sdkMut) => {
                          invariant(program.data);
                          const [programData] = await findProgramDataAddress(
                            program.data.programID
                          );
                          await handleTX(
                            await wrapTx(
                              sdkMut.provider.newTX([
                                createSetAuthorityInstruction({
                                  account: programData,
                                  authority: sdkMut.provider.wallet.publicKey,
                                  nextAuthority: key,
                                }),
                              ])
                            ),
                            `Transfer authority of ${displayAddress(
                              program.data.programID.toString()
                            )} to Smart Wallet`
                          );
                        }}
                      >
                        Transfer Authority
                      </AsyncButton>
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </BasicPage>
    );
  };
