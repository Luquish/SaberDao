import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import { useGovernor } from "@/hooks/governance/useGovernor";
import { useAuthorityPrograms } from "@/hooks/governance/useAuthorityPrograms";
import { Button } from "@/components/governance/Button";
import { NoPrograms } from "@/components/governance/common/NoPrograms";
import { LoadingPage } from "@/components/governance/common/LoadingPage";
import { LoadingSpinner } from "@/components/governance/common/LoadingSpinner";
import { Notice } from "@/components/governance/common/Notice";
import { ProgramCard } from "./ProgramCard";
import { ProgramPlaceholder } from "./ProgramPlaceholder";
import { ProgramAccountInfo } from "@/utils/governance/instructions/upgradeable_loader/types";

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
      <div tw="h-[251px] flex items-center justify-center">
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
        programData.data?.map((pdata: any) => (
          <Notice key={pdata.pubkey.toString()}>
            <LoadingSpinner />
          </Notice>
        ))}
      <div tw="flex flex-col gap-2">
        {programsToRender.map((program: ProgramAccountInfo, i: number) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.isLoading && <ProgramPlaceholder />}
              {program.data && (
                <ProgramCard
                  program={program.data}
                  actions={
                    <Link to={`${path}/proposals/create`}>
                      <Button
                        tw="py-2 px-3 hover:dark:text-primary hover:dark:border-primary"
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
