import type {
  Idl,
  IdlTypeDefTyStruct,
} from "@project-serum/anchor/dist/esm/idl";
import { formatIdlType } from "@saberhq/anchor-contrib";
import { startCase } from "lodash-es";

import { TableCardBody } from "../../../../common/card/TableCardBody";
import { DisplayValue } from "../../../../common/DisplayValue";

interface Props {
  idl: Idl;
  idlType: IdlTypeDefTyStruct;
  data: Record<string, unknown>;
}

export const AnchorObject: React.FC<Props> = ({
  idl,
  idlType,
  data,
}: Props) => {
  return (
    <>
      {Object.entries(data).map(([k, v]) => {
        const idlFieldType =
          idlType.kind === "struct"
            ? idlType.fields.find((f) => f.name === k)?.type
            : null;
        const typeInfo = (
          <div tw="flex flex-col gap-1">
            <span tw="font-medium">{startCase(k)}</span>
            {idlFieldType && (
              <span tw="text-warmGray-300">
                <code>{formatIdlType(idlFieldType)}</code>
              </span>
            )}
          </div>
        );
        if (
          idlFieldType &&
          typeof idlFieldType === "object" &&
          "vec" in idlFieldType &&
          typeof idlFieldType.vec === "object" &&
          "defined" in idlFieldType.vec
        ) {
          const definedType = idlFieldType.vec.defined;
          const elementType = idl.types?.find((t) => t.name === definedType);

          if (
            !elementType ||
            !("kind" in elementType.type) ||
            elementType.type.kind !== "struct"
          ) {
            return (
              <tr key={k}>
                <td>{typeInfo}</td>
                <td>
                  <div tw="flex flex-col items-end">
                    <DisplayValue value={v} />
                  </div>
                </td>
              </tr>
            );
          }

          const structType = elementType.type;
          const objects = v as unknown[];
          return (
            <tr key={k}>
              <td colSpan={2}>
                {typeInfo}
                <div tw="flex flex-col border border-warmGray-700 rounded mt-4">
                  {objects.map((object, i) => {
                    return (
                      <div key={i} tw="">
                        <TableCardBody>
                          <AnchorObject
                            idl={idl}
                            idlType={structType}
                            data={object as Record<string, unknown>}
                          />
                        </TableCardBody>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
          );
        }
        return (
          <tr key={k}>
            <td>{typeInfo}</td>
            <td>
              <div tw="flex flex-col items-end">
                <DisplayValue value={v} />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};
