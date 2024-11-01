import type { Idl } from "@project-serum/anchor";
import {
  ACCOUNT_DISCRIMINATOR_SIZE,
  BorshAccountsCoder,
  BorshCoder,
} from "@project-serum/anchor/dist/cjs/coder";
import type { IdlTypeDefTyStruct } from "@project-serum/anchor/dist/esm/idl";
import type { KeyedAccountInfo } from "@solana/web3.js";
import { startCase } from "lodash-es";
import { useMemo } from "react";

import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { AnchorObject } from "./AnchorObject";

interface Props {
  account: KeyedAccountInfo;
  idl: Idl;
}

export const AnchorDataCard: React.FC<Props> = ({ account, idl }: Props) => {
  const programName = useProgramLabel(account.accountInfo.owner);
  const { accountName, decoded } = useMemo(() => {
    const parser = new BorshCoder(idl);
    const discriminators = idl.accounts?.map((account) => ({
      name: account.name,
      discriminator: BorshAccountsCoder.accountDiscriminator(account.name),
    }));

    const discriminator = account.accountInfo.data.slice(
      0,
      ACCOUNT_DISCRIMINATOR_SIZE
    );

    const accountName = discriminators?.find((d) =>
      d.discriminator.equals(discriminator)
    );
    if (!accountName) {
      return { accountName: null, decoded: null };
    }

    const decoded: Record<string, unknown> | null = parser.accounts.decode(
      accountName.name,
      account.accountInfo.data
    );

    return { accountName: accountName.name, decoded };
  }, [account.accountInfo.data, idl]);

  if (!accountName) {
    return null;
  }

  const idlAccount = idl.accounts?.find(
    (account) => account.name === accountName
  );
  if (!idlAccount) {
    return null;
  }

  return (
    <Card
      title={`Anchor Parsed Data for ${programName}: ${startCase(accountName)}`}
    >
      <div tw="whitespace-nowrap overflow-x-auto">
        <TableCardBody>
          {decoded ? (
            <AnchorObject
              idl={idl}
              idlType={idlAccount.type as IdlTypeDefTyStruct}
              data={decoded}
            />
          ) : null}
        </TableCardBody>
      </div>
    </Card>
  );
};
