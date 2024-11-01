import { useAccountData, usePubkey } from "@rockooor/sail";
import { partition } from "lodash-es";
import { FaSync, FaUpload } from "react-icons/fa";
import { useParams } from "react-router";

import { useAuthorityBuffers } from "../../../../../hooks/useAuthorityPrograms";
import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { BPF_UPGRADEABLE_LOADER_ID } from "../../../../../utils/instructions/upgradeable_loader/instructions";
import { Button } from "../../../../common/Button";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { Notice } from "../../../../common/Notice";
import { BasicPage } from "../../../../common/page/BasicPage";
import { BasicSection } from "../../../../common/page/Section";
import { ProseSmall } from "../../../../common/typography/Prose";
import { BufferCard } from "./BufferCard";

export const ProgramUpgradeView: React.FC = () => {
  const { key } = useSmartWallet();
  const buffers = useAuthorityBuffers(key);
  const { programID: programIDStr } = useParams<"programID">();
  const programID = usePubkey(programIDStr);
  const { data: program } = useAccountData(programID);
  const programLabel = useProgramLabel(programID);

  const isProgram = program
    ? program?.accountInfo.owner.equals(BPF_UPGRADEABLE_LOADER_ID)
    : program;

  const [myBuffers, otherBuffers] = partition(
    buffers.data?.sort((a, b) =>
      a.pubkey.toString().localeCompare(b.pubkey.toString())
    ) ?? [],
    (buffer) => buffer.verifiableBuild?.program.address === programIDStr
  );

  return (
    <BasicPage
      title={`Upgrade Program ${programLabel}`}
      description={`Program ID: ${
        programID?.toString() ?? programIDStr ?? "--"
      }`}
    >
      <div tw="grid gap-12">
        <Notice icon={<FaUpload />} title="How do I upgrade a program?">
          <ProseSmall>
            <ol>
              <li>
                Build your program, ideally using{" "}
                <code>anchor build --verifiable</code>.
              </li>
              <li>
                Upload your program's buffer via
                <br />
                <code>
                  solana program write-buffer &lt;PROGRAM_FILEPATH&gt;
                </code>
                .
                <br />
                This will give you a buffer key. Keep track of this!
              </li>
              <li>
                Change the program's upgrade authority to this smart wallet via
                <br />
                <code>
                  solana program set-buffer-authority &lt;BUFFER_KEY&gt;
                  --new-buffer-authority {key.toString()}
                </code>
                .
              </li>
              <li>
                Use the tool below to select the buffer to upgrade, and propose
                the transaction.
              </li>
            </ol>
          </ProseSmall>
        </Notice>
        <BasicSection
          title="Verified Buffers"
          actions={
            <Button
              onClick={async () => {
                await buffers.refetch();
              }}
            >
              <FaSync />{" "}
            </Button>
          }
        >
          {(buffers.isLoading || program === undefined) && <LoadingPage />}
          {buffers.isError && <ErrorMessage error={buffers.error} />}
          {isProgram && programID && (
            <div>
              {buffers.data?.length === 0 && (
                <Notice>
                  <p>There are no buffers owned by this smart wallet.</p>
                  <p>
                    Follow the instructions above to upload the bytecode for a
                    new program upgrade.
                  </p>
                </Notice>
              )}
              <div tw="grid gap-2">
                {myBuffers.map((buffer) => (
                  <BufferCard
                    key={buffer.pubkey.toString()}
                    buffer={buffer}
                    programID={programID}
                  />
                ))}
              </div>
            </div>
          )}
        </BasicSection>
        {programID && otherBuffers.length > 0 && (
          <BasicSection
            title="Available Buffers"
            actions={
              <Button
                onClick={async () => {
                  await buffers.refetch();
                }}
              >
                <FaSync />{" "}
              </Button>
            }
          >
            <div tw="grid gap-2">
              {otherBuffers.map((buffer) => (
                <BufferCard
                  key={buffer.pubkey.toString()}
                  buffer={buffer}
                  programID={programID}
                />
              ))}
            </div>
          </BasicSection>
        )}
      </div>
    </BasicPage>
  );
};
