import type { QuarryInfo } from "@rockooor/react-quarry";
import { useRewarder } from "@rockooor/react-quarry";
import { usePubkeysMemo, useTokens } from "@rockooor/sail";
import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import clsx from "clsx";

import { useSDK } from "../../../../../contexts/sdk";
import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { Button } from "../../../../../components/tribeca/common/Button";
import { TableCardBody } from "../../../../../components/tribeca/common/card/TableCardBody";
import {
  EmptyState,
  EmptyStateConnectWallet,
} from "../../../../../components/tribeca/common/EmptyState";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { ModalButton } from "../../../../../components/tribeca/common/Modal/ModalButton";
import { useAllGauges } from "../hooks/useGauges";
import { GaugeWeightRow } from "./GaugeWeightRow";
import { SetWeightsModal } from "./SetWeightsModal";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

interface Props {
  filterTerm: string;
}

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  return {
    governor: paths[3] || '' // Asumiendo /tribeca/gov/:governor/
  };
}

export const GaugeWeightsForm: React.FC<Props> = ({ filterTerm }: Props) => {
  const location = useLocation();
  const { governor } = getParams(location.pathname);
  const { escrow, isLoading } = useUserEscrow();
  const { quarries, quarriesLoading } = useRewarder();
  const [filteredQuarries, setFilteredQuarries] = React.useState<
    readonly QuarryInfo[]
  >([]);
  const { sharesDiff } = useUpdateGaugeWeights();
  const { gauges } = useAllGauges();
  const { sdkMut } = useSDK();

  const allTokens = useTokens(
    usePubkeysMemo(
      quarries?.map((quarry: QuarryInfo) => quarry.quarry.account.tokenMintKey) ?? []
    )
  );

  React.useEffect(() => {
    if (filterTerm === "") {
      setFilteredQuarries(quarries ?? []);
    }

    const filter = (quarries: readonly QuarryInfo[]) => {
      return quarries.filter(
        (quarry) =>
          allTokens
            .find((tok) =>
              tok.data?.mintAccount.equals(quarry.quarry.account.tokenMintKey)
            )
            ?.data?.name.toLowerCase()
            .indexOf(filterTerm.toLowerCase()) !== -1
      );
    };

    const delaySearch = setTimeout(() => {
      if (quarries) {
        setFilteredQuarries(filter(quarries));
      }
    }, 100);

    return () => clearTimeout(delaySearch);
  }, [allTokens, filterTerm, quarries]);

  if (quarriesLoading) {
    return <LoadingPage className="p-16" />;
  }

  if (!sdkMut) {
    return (
      <EmptyStateConnectWallet title="Connect your wallet to vote on gauges." />
    );
  }

  if (!escrow && !isLoading) {
    return (
      <EmptyState
        title="Locker Escrow Not Found"
        icon={<FaExclamationCircle />}
      >
        <div className="py-2.5">
          <Link
            to={`/tribeca/gov/${governor ?? ""}/locker`}
            className={clsx(
              "w-full rounded text-sm font-semibold transition-colors",
              "hover:text-white"
            )}
          >
            <Button variant="primary">Lock Tokens</Button>
          </Link>
        </div>
      </EmptyState>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <TableCardBody
          head={
            <tr>
              <th>Token</th>
              <th>Current Share (%)</th>
              <th>Weight</th>
              <th>New Share (%)</th>
            </tr>
          }
        >
          {filteredQuarries.map((quarry) =>
            gauges?.find(
              (gauge: any) =>
                gauge?.account.quarry.equals(quarry.key) &&
                !gauge.account.isDisabled
            ) ? (
              <GaugeWeightRow key={quarry.key.toString()} quarry={quarry} />
            ) : null
          )}
        </TableCardBody>
      </div>
      <div className="w-full flex flex-col items-center p-8">
        <ModalButton
          buttonLabel="Update Weights"
          buttonProps={{
            variant: "outline",
            disabled: sharesDiff.length === 0,
            className: clsx(
              "w-3/5",
              "hover:not-disabled:border-primary hover:not-disabled:text-primary"
            ),
          }}
        >
          <SetWeightsModal />
        </ModalButton>
      </div>
    </>
  );
};
