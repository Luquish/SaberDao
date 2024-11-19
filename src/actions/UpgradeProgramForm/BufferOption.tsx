import type { ProgramDeployBuffer } from "@/hooks/tribeca/useAuthorityPrograms";
import { truncateShasum } from "@/hooks/tribeca/useSha256Sum";
import { displayAddress } from "@/utils/tribeca/programs";
import React from "react";

interface Props {
  buffer: ProgramDeployBuffer;
}

export default function BufferOption({ buffer }: Props) {
  const shasum = buffer.sha256Sum;
  return (
    <option key={buffer.pubkey.toString()} value={buffer.pubkey.toString()}>
      {displayAddress(buffer.pubkey.toString())}
      {` (SHA256: ${truncateShasum(shasum)})`}
    </option>
  );
}

