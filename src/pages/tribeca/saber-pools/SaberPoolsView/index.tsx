import React from "react";
import { useSaberSwaps } from "@/hooks/tribeca/saber/useSaberSwaps";
import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import TableCardBody from "@/components/tribeca/common/card/TableCardBody";
import Card from "@/components/tribeca/common/governance/Card";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";

const SaberPoolsView: React.FC = () => {
  const { data: swaps } = useSaberSwaps();
  const { path } = useGovernor();
  useGovWindowTitle(`All Pools`);
  return (
    <GovernancePage
      title="All Saber Pools"
      backLink={{
        label: "Overview",
        href: path,
      }}
    >
      <div className="flex flex-col gap-8">
        <Card title={`All Pools (${swaps?.length ?? "Loading..."})`}>
          <TableCardBody
            head={
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            }
          >
            {swaps
              ?.filter((swap) => swap.isVerified)
              .map((swap) => (
                <tr key={swap.id}>
                  <td>{swap.id}</td>
                  <td>{swap.name}</td>
                </tr>
              ))}
          </TableCardBody>
        </Card>
      </div>
    </GovernancePage>
  );
};

export default SaberPoolsView;
