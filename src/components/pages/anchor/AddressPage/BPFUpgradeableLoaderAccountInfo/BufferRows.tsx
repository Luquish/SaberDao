import { FaExclamationTriangle, FaQuestionCircle } from "react-icons/fa";

import { stripTrailingNullBytes } from "../../../../../hooks/deploydao/stripTrailingNullBytes";
import { useCanonicalVerifiableBuild } from "../../../../../hooks/deploydao/useCanonicalVerifiableBuild";
import { useSha256Sum } from "../../../../../hooks/useSha256Sum";
import type { BPFUpgradeableLoaderAccount } from "../../../../../utils/instructions/upgradeable_loader/types";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";
import { InternalLink } from "../../../../common/typography/ExternalLink";

interface Props {
  data: BPFUpgradeableLoaderAccount & { type: "buffer" };
}

export const BufferRows: React.FC<Props> = ({ data }: Props) => {
  const canonicalData = stripTrailingNullBytes(Buffer.from(data.data));
  const { data: hash } = useSha256Sum(Buffer.from(data.data));
  const { data: canonicalHash } = useSha256Sum(canonicalData);

  const {
    data: verifiableBuild,
    isLoading: verifiableLoading,
    isFetched: isVerifiableFetched,
  } = useCanonicalVerifiableBuild(canonicalHash ?? "");

  return (
    <>
      <tr>
        <th>Deploy Authority</th>
        <td>
          <AddressWithContext pubkey={data.authority} />
        </td>
      </tr>
      <tr>
        <th>Size (bytes)</th>
        <td>{data.data.byteLength.toLocaleString()}</td>
      </tr>
      <tr>
        <th>Hash</th>
        <td>
          <code>{hash}</code>
        </td>
      </tr>
      <tr>
        <th>Canonical Size (bytes)</th>
        <td>{canonicalData.byteLength.toLocaleString()}</td>
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
          <code>{canonicalHash}</code>
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
              {verifiableBuild.program.name} - {verifiableBuild.id}
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
    </>
  );
};
