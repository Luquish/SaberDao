import type { QuarryInfo } from "@rockooor/react-quarry";
import { useRewarder } from "@rockooor/react-quarry";
import { usePubkeysMemo, useTokens } from "@rockooor/sail";
import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import tw from "twin.macro";

import { useSDK } from "../../../../../contexts/sdk";
import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { Button } from "../../../../common/Button";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import {
  EmptyState,
  EmptyStateConnectWallet,
} from "../../../../common/EmptyState";
import { LoadingPage } from "../../../../common/LoadingPage";
import { ModalButton } from "../../../../common/Modal/ModalButton";
import { useAllGauges } from "../hooks/useGauges";
import { GaugeWeightRow } from "./GaugeWeightRow";
import { SetWeightsModal } from "./SetWeightsModal";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

interface Props {
  filterTerm: string;
}

export const GaugeWeightsForm: React.FC<Props> = ({ filterTerm }: Props) => {
  const { governor } = useParams<"governor">();
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
      quarries?.map((quarry) => quarry.quarry.account.tokenMintKey) ?? []
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
    return <LoadingPage tw="p-16" />;
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
        <div tw="py-2.5">
          <NavLink
            className={({ isActive }) => (isActive ? "active" : "")}
            to={`/gov/${governor ?? ""}/locker`}
          >
            <Button
              variant="primary"
              css={[tw`w-full rounded text-sm font-semibold transition-colors`]}
            >
              Lock Tokens
            </Button>
          </NavLink>
        </div>
      </EmptyState>
    );
  }

  return (
    <>
      <div tw="overflow-x-auto">
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
              (gauge) =>
                gauge?.account.quarry.equals(quarry.key) &&
                !gauge.account.isDisabled
            ) ? (
              <GaugeWeightRow key={quarry.key.toString()} quarry={quarry} />
            ) : null
          )}
        </TableCardBody>
      </div>
      <div tw="w-full flex flex-col items-center p-8">
        <ModalButton
          buttonLabel={"Update Weights"}
          buttonProps={{
            variant: "outline",
            disabled: sharesDiff.length === 0,
            css: [tw`w-3/5 hover:not-disabled:(border-primary text-primary)`],
          }}
        >
          <SetWeightsModal />
        </ModalButton>
      </div>
    </>
  );
};
