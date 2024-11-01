import type {
  IdlAccount,
  IdlAccountItem,
} from "@project-serum/anchor/dist/cjs/idl";
import { useAccountData, usePubkey } from "@rockooor/sail";
import { useParams } from "react-router";
import * as semver from "semver";
import tw, { css } from "twin.macro";

import { useProgramMeta } from "../../../../../hooks/deploydao/useProgramMeta";
import { useIDL } from "../../../../../hooks/useIDLs";
import { useWindowTitle } from "../../../../../hooks/useWindowTitle";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { AddressLink } from "../../../../common/AddressLink";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { EmptyState } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";
import {
  ExternalLink,
  InternalLink,
} from "../../../../common/typography/ExternalLink";
import { AnchorLayout } from "../../../../layout/AnchorLayout";
import { ProgramData } from "./ProgramData";

const flattenIdlAccounts = (
  accounts: IdlAccountItem[],
  prefix?: string
): IdlAccount[] => {
  return accounts.flatMap((account): IdlAccount[] => {
    const accName = account.name;
    if ("accounts" in account) {
      const newPrefix = prefix ? `${prefix} > ${accName}` : accName;
      return flattenIdlAccounts(account.accounts, newPrefix);
    } else {
      return [
        {
          ...account,
          name: prefix ? `${prefix} > ${accName}` : accName,
        },
      ];
    }
  });
};

export const ProgramPage: React.FC = () => {
  const { programID: programIDStr } = useParams<"programID">();

  const { network } = useEnvironment();
  const programID = usePubkey(programIDStr);
  const { data: programMeta } = useProgramMeta(programIDStr);
  const { data: idlInfo } = useIDL(programID);
  const { data: account } = useAccountData(programID);

  const programLabel =
    programMeta?.program.label ??
    `Unknown (${programID?.toString() ?? programIDStr ?? "--"}) Program`;
  useWindowTitle(`${programLabel} | Anchor.so`);

  return (
    <AnchorLayout
      title={`Program: ${programLabel}`}
      innerStyles={tw`max-w-3xl`}
    >
      <div tw="flex flex-col gap-8">
        <Card title="Program Info">
          <TableCardBody rightAlignEnd>
            <tr>
              <th>Address</th>
              <td>{programID && <AddressWithContext pubkey={programID} />}</td>
            </tr>
            <tr>
              <th>GitHub</th>
              <td>
                {programMeta ? (
                  <ExternalLink
                    tw="justify-end"
                    href={`https://github.com/${programMeta.program.github.organization}/${programMeta.program.github.repo}`}
                  >
                    {programMeta.program.github.organization}/
                    {programMeta.program.github.repo}
                  </ExternalLink>
                ) : (
                  <span tw="text-gray-500">Not found</span>
                )}
              </td>
            </tr>
          </TableCardBody>
        </Card>
        {account === null && (
          <Card title="Program Data">
            <EmptyState title="Program not found">
              The program at{" "}
              {programID ? (
                <AddressLink address={programID} showCopy />
              ) : (
                programIDStr
              )}{" "}
              could not be found on <code>{network}</code>.
            </EmptyState>
          </Card>
        )}
        {programID && account && <ProgramData programID={programID} />}
        {programMeta && (
          <Card title="Release History">
            <TableCardBody
              head={
                <tr>
                  <th>Version</th>
                  <th>Build Date</th>
                  <th>Links</th>
                </tr>
              }
            >
              {programMeta.releases
                .sort((a, b) => {
                  return semver.gt(a.build.build.tag, b.build.build.tag)
                    ? -1
                    : 1;
                })
                .map(({ build: { build: release, info } }) => (
                  <tr key={release.tag}>
                    <td>
                      <InternalLink
                        to={`/builds/${release.org}/${programMeta.program.name}/${release.tag}`}
                      >
                        {release.tag}
                      </InternalLink>
                    </td>
                    <td>
                      {info?.createdAt ? (
                        new Date(info.createdAt).toLocaleString(undefined, {
                          timeZoneName: "short",
                        })
                      ) : (
                        <span tw="text-gray-500">--</span>
                      )}
                    </td>
                    <td>
                      <ExternalLink
                        href={`https://github.com/DeployDAO/verified-program-artifacts/tree/verify-${release.slug}`}
                      >
                        Artifacts
                      </ExternalLink>
                    </td>
                    <td>
                      <ExternalLink href={release.source}>Source</ExternalLink>
                    </td>
                  </tr>
                ))}
            </TableCardBody>
          </Card>
        )}
        {idlInfo?.idl && (
          <Card title="IDL (raw)">
            <textarea tw="w-full bg-transparent border-none focus:(ring-0 outline-none) font-mono px-7 py-4 text-sm resize-none">
              {JSON.stringify(idlInfo.idl, null, 2)}
            </textarea>
          </Card>
        )}
        {idlInfo?.idl && (
          <Card title="Instructions">
            <TableCardBody
              head={
                <tr>
                  <th>Instruction</th>
                  <th>Arguments</th>
                  <th>Accounts</th>
                </tr>
              }
              css={css`
                td {
                  ${tw`align-top`}
                }
              `}
            >
              {[
                ...idlInfo.idl.instructions,
                ...(idlInfo.idl.state?.methods.map((ix) => ({
                  ...ix,
                  name: `${idlInfo.idl?.name ?? "program"}#${ix.name}`,
                })) ?? []),
              ].map((ix) => (
                <tr key={ix.name}>
                  <td>{ix.name}</td>
                  <td>
                    <div tw="flex flex-col gap-1">
                      {ix.args.map((arg) => (
                        <div key={arg.name}>
                          <span tw="text-white">{arg.name}</span>:{" "}
                          <span tw="font-mono">
                            {typeof arg.type === "string"
                              ? arg.type
                              : JSON.stringify(arg.type)}
                          </span>
                        </div>
                      ))}
                      {ix.args.length === 0 && <span>(none)</span>}
                    </div>
                  </td>
                  <td>
                    <div tw="flex flex-col gap-1">
                      {flattenIdlAccounts(ix.accounts).map((account, i) => (
                        <div tw="flex items-center gap-0.5" key={i}>
                          <span tw="text-white">{account.name}</span>
                          {account.isMut && <span tw="text-accent">[w]</span>}
                          {account.isSigner && (
                            <span tw="text-primary">[s]</span>
                          )}
                        </div>
                      ))}
                      {ix.accounts.length === 0 && <span>(none)</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </TableCardBody>
          </Card>
        )}
      </div>
    </AnchorLayout>
  );
};

export default ProgramPage;
