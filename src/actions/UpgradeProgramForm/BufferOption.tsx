import type { ProgramDeployBuffer } from "../../hooks/useAuthorityPrograms";
import { truncateShasum } from "../../hooks/useSha256Sum";
import { displayAddress } from "../../utils/programs";

interface Props {
  buffer: ProgramDeployBuffer;
}

export const BufferOption: React.FC<Props> = ({ buffer }: Props) => {
  const shasum = buffer.sha256Sum;
  return (
    <option key={buffer.pubkey.toString()} value={buffer.pubkey.toString()}>
      {displayAddress(buffer.pubkey.toString())}
      {` (SHA256: ${truncateShasum(shasum)})`}
    </option>
  );
};
