import type { PublicKey } from "@solana/web3.js";
import { FaExclamationTriangle, FaQuestionCircle } from "react-icons/fa";

import { useCanonicalVerifiableBuild } from "../../../../../hooks/deploydao/useCanonicalVerifiableBuild";
import { useProgramData } from "../../../../../hooks/deploydao/useProgramData";
import { useSha256Sum } from "../../../../../hooks/useSha256Sum";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";
import { InternalLink } from "../../../../common/typography/ExternalLink";

interface Props {
  programID: PublicKey;
}

export const ProgramData: React.FC<Props> = ({ programID }: Props) => {
  const { programData, canonicalData } = useProgramData(programID);
  const { data: hash } = useSha256Sum(canonicalData);
  const {
    data: verifiableBuild,
    isLoading: verifiableLoading,
    isFetched: isVerifiableFetched,
  } = useCanonicalVerifiableBuild(hash ?? "");

  return (
    <Card title="Program Data">
      <TableCardBody rightAlignEnd>
        <tr>
          <th>Upgrade Authority</th>
          <td>
            {programData ? (
              <AddressWithContext
                pubkey={programData.accountInfo.data.upgradeAuthority}
              />
            ) : programData === undefined ? (
              <LoadingSpinner />
            ) : (
              "--"
            )}
          </td>
        </tr>
        <tr>
          <th>Last Deployed Slot</th>
          <td>
            {programData ? (
              programData.accountInfo.data.lastDeployedSlot
                .toNumber()
                .toLocaleString()
            ) : programData === undefined ? (
              <LoadingSpinner />
            ) : (
              "--"
            )}
          </td>
        </tr>
        <tr>
          <th>Size (bytes)</th>
          <td>
            {programData?.accountInfo.data.data.byteLength.toLocaleString()}
          </td>
        </tr>
        <tr>
          <th>Canonical Size (bytes)</th>
          <td>{canonicalData?.byteLength.toLocaleString()}</td>
        </tr>
        <tr>
          <th>
            <div tw="flex items-center gap-1">
              <span>Hash (canonical)</span>
              <MouseoverTooltip text="The canonical hash is the SHA256 checksum of the program executable data with all trailing null bytes removed.">
                <FaQuestionCircle />
              </MouseoverTooltip>
            </div>
          </th>
          <td>
            <code>{hash}</code>
          </td>
        </tr>
        <tr>
          <th>Verified Source</th>
          <td>
            {verifiableBuild ? (
              <InternalLink
                tw="justify-end"
                to={`/builds/${verifiableBuild.build.build.org}/${verifiableBuild.program.name}/${verifiableBuild.build.build.tag}`}
              >
                {verifiableBuild.id}
              </InternalLink>
            ) : !hash || verifiableLoading || !isVerifiableFetched ? (
              <div tw="flex items-center justify-end gap-1">
                <span>Verifiying...</span>
                <LoadingSpinner />
              </div>
            ) : (
              <MouseoverTooltip text="The sources used to build this binary have not been verified. Use extreme caution when interacting with this program.">
                <div tw="flex items-center justify-end gap-1 text-red-500">
                  <FaExclamationTriangle />
                  <span>Unverified Binary</span>
                </div>
              </MouseoverTooltip>
            )}
          </td>
        </tr>
      </TableCardBody>
    </Card>
  );
};
