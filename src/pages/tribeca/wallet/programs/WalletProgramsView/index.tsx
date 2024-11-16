import { RouteComponentProps } from '@reach/router';
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useAuthorityPrograms } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { Button } from "../../../../../components/tribeca/common/Button";
import { EmptyState } from "../../../../../components/tribeca/common/EmptyState";
import { ErrorMessage } from "../../../../../components/tribeca/common/ErrorMessage";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { LoadingSpinner } from "../../../../../components/tribeca/common/LoadingSpinner";
import { Notice } from "../../../../../components/tribeca/common/Notice";
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { ReactComponent as EmptyFolder } from "../../../../../components/tribeca/common/svgs/EmptyFolder.svg";
import { ProgramCard } from "./ProgramCard";

export const WalletProgramsView: React.FC<RouteComponentProps> = () => {
  const { key, path } = useSmartWallet();
  const { programs, programData } = useAuthorityPrograms(key);
  const isEmpty = programs.length === 0 && programData.isFetched;

  return (
    <BasicPage
      title="Programs"
      description="Manage the programs that this wallet can upgrade."
    >
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
      {isEmpty && (
        <EmptyState
          icon={<EmptyFolder />}
          title="This wallet doesn't own any programs."
        >
          <Link
            to={`/tribeca/wallets/${key.toString()}/programs/import`}
            className="text-primary"
          >
            Import a program
          </Link>
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
                    <Link
                      to={`${path}/programs/${program.data.programID.toString()}/upgrade`}
                    >
                      <Button>Upgrade</Button>
                    </Link>
                  }
                />
              )}
            </div>
          );
        })}
      </div>
      {!isEmpty && (
        <div className="mt-6">
          <Link to={`${path}/programs/import`}>
            <Button>Import an existing program</Button>
          </Link>
        </div>
      )}
    </BasicPage>
  );
};
