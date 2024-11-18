import { useMemo } from "react";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useAuthorityPrograms } from "@/hooks/tribeca/useAuthorityPrograms";
import { Button } from "@/components/tribeca/common/Button";
import { NoPrograms } from "@/components/tribeca/common/governance/NoPrograms";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { LoadingSpinner } from "@/components/tribeca/common/LoadingSpinner";
import { Notice } from "@/components/tribeca/common/Notice";
import { ProgramCard } from "./ProgramCard";
import { ProgramPlaceholder } from "./ProgramPlaceholder";

interface Props {
  maxCount?: number;
}

export const ProgramsList: React.FC<Props> = ({ maxCount = 100 }: Props) => {
  const { smartWallet, path } = useGovernor();
  const { programs, programData } = useAuthorityPrograms(smartWallet);
  const programsToRender = useMemo(
    () => programs.slice(0, maxCount),
    [maxCount, programs]
  );

  if (!smartWallet || programData.isLoading) {
    return (
      <div className="h-[251px] flex items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  const isEmpty = programs.length === 0 && programData.isFetched;
  if (isEmpty) {
    return <NoPrograms smartWallet={smartWallet} />;
  }

  return (
    <>
      {programs.length === 0 &&
        programData.data?.map((pdata) => (
          <Notice key={pdata.pubkey.toString()}>
            <LoadingSpinner />
          </Notice>
        ))}
      <div className="flex flex-col gap-2">
        {programsToRender.map((program, i) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.isLoading && <ProgramPlaceholder />}
              {program.data && (
                <ProgramCard
                  program={program.data}
                  actions={
                    <Link to={`/tribeca${path}/proposals/create`}>
                      <Button
                        className="py-2 px-3 hover:dark:text-primary hover:dark:border-primary"
                        variant="outline"
                      >
                        Upgrade
                      </Button>
                    </Link>
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
