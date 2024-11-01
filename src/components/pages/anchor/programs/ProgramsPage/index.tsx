import { Link } from "react-router-dom";

import { useProgramIndex } from "../../../../../hooks/deploydao/useProgramIndex";
import { useWindowTitle } from "../../../../../hooks/useWindowTitle";
import { AddressLink } from "../../../../common/AddressLink";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { AnchorLayout } from "../../../../layout/AnchorLayout";

export const ProgramsPage: React.FC = () => {
  useWindowTitle(`Solana Program Registry | Anchor.so`);

  const { data: programs } = useProgramIndex();

  return (
    <AnchorLayout title="Solana Program Registry">
      <div tw="flex flex-col gap-8">
        <Card title="All Programs">
          <div tw="overflow-x-scroll whitespace-nowrap">
            {programs && (
              <TableCardBody
                head={
                  <tr>
                    <th>Program</th>
                    <th>Name</th>
                    <th>Publisher</th>
                    <th>GitHub Repo</th>
                    <th>Address</th>
                  </tr>
                }
              >
                {programs.map((program) => {
                  return (
                    <tr key={program.label}>
                      <td>
                        <Link
                          to={`/programs/${program.address.toString()}`}
                          tw="text-primary hover:text-white transition-colors"
                        >
                          {program.label}
                        </Link>
                      </td>
                      <td>{program.name}</td>
                      <td>{program.github.organization}</td>
                      <td>{program.github.repo}</td>
                      <td>
                        <AddressLink address={program.address} showCopy />
                      </td>
                    </tr>
                  );
                })}
              </TableCardBody>
            )}
          </div>
        </Card>
      </div>
    </AnchorLayout>
  );
};

export default ProgramsPage;
