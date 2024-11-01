import { FaDownload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import tw, { css } from "twin.macro";

import { useProgramRelease } from "../../../../../hooks/deploydao/useProgramRelease";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { AnchorLayout } from "../../../../layout/AnchorLayout";
import { BuildInfo } from "./BuildInfo";

export const BuildPage: React.FC = () => {
  const {
    org = "",
    programName = "",
    version = "",
  } = useParams<{
    org: string;
    programName: string;
    version: string;
  }>();
  const { data: release } = useProgramRelease(org, programName, version);
  return (
    <AnchorLayout
      title={`${release?.program.label ?? ""} ${
        release?.build.build.tag ?? ""
      }`}
      innerStyles={tw`max-w-3xl`}
    >
      {release && (
        <div tw="flex flex-col gap-8">
          <Card title="Release Info">
            <div tw="whitespace-nowrap overflow-x-scroll">
              <TableCardBody
                css={css`
                  td {
                    ${tw`text-right`}
                  }
                `}
              >
                <tr>
                  <th>Release ID</th>
                  <td tw="text-white">{release?.id}</td>
                </tr>
                <tr>
                  <th>Binary</th>
                  <td>
                    <a
                      tw="flex items-center justify-end gap-1 transition-colors text-primary hover:text-white"
                      target="_blank"
                      href={release.artifact.downloadURL}
                      rel="noreferrer"
                    >
                      <strong>{release.program.name}.so</strong> (
                      {release.artifact.size?.toLocaleString()} bytes)
                      <FaDownload />
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Checksum (SHA256)</th>
                  <td>{release?.artifact.checksum}</td>
                </tr>
                <tr>
                  <th>Trimmed Binary</th>
                  <td>
                    <a
                      tw="flex items-center justify-end gap-1 transition-colors text-primary hover:text-white"
                      target="_blank"
                      href={release.trimmedArtifact.downloadURL}
                      rel="noreferrer"
                    >
                      <strong>{release.program.name}-trimmed.so</strong> (
                      {release.trimmedArtifact.size?.toLocaleString()} bytes)
                      <FaDownload />
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Canonical Checksum (SHA256)</th>
                  <td>{release?.trimmedArtifact.checksum}</td>
                </tr>
              </TableCardBody>
            </div>
          </Card>
          <BuildInfo build={release.build} />
        </div>
      )}
    </AnchorLayout>
  );
};

export default BuildPage;
