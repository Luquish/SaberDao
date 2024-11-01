import { FaDownload } from "react-icons/fa";
import tw, { css } from "twin.macro";

import type { BuildDetails } from "../../../../../hooks/deploydao/types";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { ExternalLink } from "../../../../common/typography/ExternalLink";

interface Props {
  build: BuildDetails;
}

export const BuildInfo: React.FC<Props> = ({ build }: Props) => {
  const release = build.artifacts.find((art) => art.path === "release.tar.gz");
  return (
    <Card title="Build Info">
      <div tw="whitespace-nowrap overflow-x-scroll">
        <TableCardBody
          css={css`
            td {
              ${tw`text-right`}
            }
          `}
        >
          <tr>
            <th>Slug</th>
            <td>
              <ExternalLink href={build.workspaceURL} tw="justify-end">
                {build.build.slug}
              </ExternalLink>
            </td>
          </tr>
          <tr>
            <th>Release</th>
            <td>
              {release && (
                <a
                  tw="flex items-center gap-1 justify-end transition-colors text-primary hover:text-white"
                  target="_blank"
                  href={release.downloadURL}
                  rel="noreferrer"
                >
                  <strong>release.tar.gz</strong> (
                  {release.size?.toLocaleString()} bytes)
                  <FaDownload />
                </a>
              )}
            </td>
          </tr>
          <tr>
            <th>Source</th>
            <td>
              <ExternalLink tw="justify-end" href={build.build.source} noIcon>
                {build.build.source}
              </ExternalLink>
            </td>
          </tr>
        </TableCardBody>
      </div>
    </Card>
  );
};
