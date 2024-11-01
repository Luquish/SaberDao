import { groupBy } from "lodash-es";
import tw from "twin.macro";

import { useWindowTitle } from "../../../../hooks/useWindowTitle";
import { TableCardBody } from "../../../common/card/TableCardBody";
import { CommonHelmet } from "../../../common/CommonHelmet";
import { Card } from "../../../common/governance/Card";
import { AnchorLayout } from "../../../layout/AnchorLayout";
import { LangErrorCode, LangErrorMessage } from "./errors";

const GROUPS = [
  "Instruction",
  "IDL instruction",
  "Constraint",
  "Account",
  "State",
  "Misc",
];

export const ErrorsPage: React.FC = () => {
  useWindowTitle(`Error Cheat Sheet | Anchor.so`);
  const errorsList = Object.entries(LangErrorCode).map(([name, code]) => {
    const info = LangErrorMessage.get(code);
    return {
      name,
      msg: info,
      code: code,
      group: Math.floor(code / 1_000),
    };
  });
  const groupedErrors = groupBy(errorsList, (error) => error.group);
  return (
    <AnchorLayout title="Anchor Errors" innerStyles={tw`max-w-3xl`}>
      <CommonHelmet
        title="Error Cheat Sheet"
        description="A cheat sheet of Anchor error codes and their corresponding descriptions."
      />
      <div tw="flex flex-col gap-8">
        <Card title="Anchor Errors Cheat Sheet">
          <div tw="text-sm px-8 py-4 flex flex-col gap-4">
            <p>List of all Anchor errors.</p>
            <p>
              This list comes from{" "}
              <a
                tw="text-primary hover:text-white transition-all"
                href="https://github.com/project-serum/anchor/blob/master/ts/src/error.ts"
                target="_blank"
                rel="noreferrer"
              >
                https://github.com/project-serum/anchor/blob/master/ts/src/error.ts
              </a>
              .
            </p>
            <p>
              Contact{" "}
              <a
                tw="text-primary hover:text-white transition-all"
                href="https://twitter.com/simplyianm"
                target="_blank"
                rel="noreferrer"
              >
                @simplyianm
              </a>{" "}
              if this list is out of date!
            </p>
          </div>
        </Card>
        {Object.values(groupedErrors).map((errors, i) => (
          <Card key={i} title={`${GROUPS[i] ?? "Unknown"} Errors`}>
            <div tw="whitespace-nowrap overflow-x-auto text-sm">
              <TableCardBody>
                {errors.map((error) => (
                  <tr key={error.code}>
                    <td tw="w-32">
                      {error.code}{" "}
                      <span tw="font-mono">(0x{error.code.toString(16)})</span>
                    </td>
                    <td tw="w-72">{error.name}</td>
                    <td>
                      <div tw="whitespace-normal">{error.msg}</div>
                    </td>
                  </tr>
                ))}
              </TableCardBody>
            </div>
          </Card>
        ))}
      </div>
    </AnchorLayout>
  );
};

export default ErrorsPage;
