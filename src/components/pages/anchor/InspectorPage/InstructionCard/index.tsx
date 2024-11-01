import type { TransactionInstruction } from "@solana/web3.js";
import React from "react";
import tw from "twin.macro";

import { useParsedInstruction } from "../../../../../hooks/tx/useParsedInstruction";
import { Badge } from "../../../../common/Badge";
import { Button } from "../../../../common/Button";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import {
  AddressWithContext,
  programValidator,
} from "../../../../common/program/AddressWithContext";
import { HexData } from "../../../../common/program/HexData";
import { fmtObject } from "../SimulationSection/AccountDiff/makeDiff";

interface Props {
  ix: TransactionInstruction;
  index: number;
}

export const InstructionCard: React.FC<Props> = ({ ix, index }: Props) => {
  const [expanded, setExpanded] = React.useState(false);
  const programId = ix.programId;
  const { title, data: ixData, accounts } = useParsedInstruction(ix);
  return (
    <Card
      titleStyles={tw`w-full flex items-center justify-between`}
      title={
        <>
          <h3 tw="mb-0 flex items-center gap-2">
            <Badge tw="bg-teal-700 text-teal-300 font-semibold text-sm h-auto px-2">
              #{index + 1}
            </Badge>
            {title}
          </h3>

          <Button
            variant="outline"
            className={`btn btn-sm d-flex ${
              expanded ? "btn-black active" : "btn-white"
            }`}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </>
      }
    >
      <div
        tw="whitespace-nowrap overflow-x-auto"
        id={`instruction-index-${index + 1}`}
        key={index}
      >
        {expanded && (
          <TableCardBody>
            <tr>
              <td>Program</td>
              <td tw="lg:text-right">
                {programId && (
                  <AddressWithContext
                    pubkey={programId}
                    validator={programValidator}
                  />
                )}
              </td>
            </tr>
            {ix.keys.map(
              ({ pubkey: accountId, isSigner, isWritable }, index) => {
                const parsedIXAccount = accounts[index];
                const label = parsedIXAccount?.name ?? `Account #${index + 1}`;
                return (
                  <tr key={index}>
                    <td>
                      <div tw="flex items-start flex-col">
                        {label}
                        <div tw="mt-1 text-xs">
                          {isSigner && (
                            <Badge tw="bg-primary-700 text-primary-200">
                              Signer
                            </Badge>
                          )}
                          {isWritable && (
                            <Badge tw="bg-accent-500 bg-opacity-60 text-accent-200">
                              Writable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {accountId && (
                        <AddressWithContext
                          pubkey={accountId}
                          prefixLinkUrlWithAnchor={true}
                        />
                      )}
                    </td>
                  </tr>
                );
              }
            )}
            <tr>
              <td>
                Instruction Data{" "}
                {!ixData && <span tw="text-gray-500">(Hex)</span>}
              </td>
              <td>
                {ixData ? (
                  <Card tw="flex flex-col items-end">
                    {ixData.type === "anchor" && (
                      <TableCardBody>
                        {ixData.args.length === 0 ? (
                          <div>No data</div>
                        ) : (
                          ixData.args.map(({ name, type, data }, i) => {
                            return (
                              <tr key={i}>
                                <td tw="pr-6">
                                  {name}{" "}
                                  <span tw="text-gray-500">({type})</span>
                                </td>
                                <td>{data}</td>
                              </tr>
                            );
                          })
                        )}
                      </TableCardBody>
                    )}
                    {ixData.type === "object" && (
                      <pre>
                        <code>
                          {fmtObject(ixData.args as Record<string, unknown>)}
                        </code>
                      </pre>
                    )}
                  </Card>
                ) : (
                  <HexData raw={Buffer.from(ix.data)} />
                )}
              </td>
            </tr>
          </TableCardBody>
        )}
      </div>
    </Card>
  );
};
