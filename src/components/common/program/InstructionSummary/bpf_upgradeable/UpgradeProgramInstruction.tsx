import invariant from "tiny-invariant";

import type { RichParsedInstruction } from "../../../../../hooks/tx/useParsedInstruction";
import { useProgramDeployBuffer } from "../../../../../hooks/useAuthorityPrograms";
import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { AddressLink } from "../../../AddressLink";

interface Props {
  data: RichParsedInstruction;
}

export const UpgradeProgramInstruction: React.FC<Props> = ({ data }: Props) => {
  const bufferID = data.accounts.find(
    (account) => account.name === "Buffer"
  )?.pubkey;
  const programID = data.accounts.find(
    (account) => account.name === "Program"
  )?.pubkey;
  invariant(programID && bufferID);
  const label = useProgramLabel(programID);
  const { data: programDeployBuffer } = useProgramDeployBuffer(bufferID);
  return (
    <>
      Upgrade Program:&nbsp;
      <AddressLink address={programID}>{label}</AddressLink>
      {programDeployBuffer?.verifiableBuild ? (
        <>
          &nbsp;to&nbsp;
          <a
            tw="hover:text-primary"
            href={programDeployBuffer.verifiableBuild.build.build.source}
            target="_blank"
            rel="noreferrer"
          >
            {programDeployBuffer.verifiableBuild.build.build.tag}
          </a>
        </>
      ) : (
        ""
      )}
    </>
  );
};
