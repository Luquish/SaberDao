import ContentLoader from "@/components/tribeca/common/ContentLoader";
import { EmptyState } from "@/components/tribeca/common/EmptyState";
import type { Props as TableCardProps } from "@/components/tribeca/common/card/TableCardBody";
import TableCardBody from "@/components/tribeca/common/card/TableCardBody";
import React from "react";

export interface RowProps<T> {
  item: T;
  index: number;
  isLast: boolean;
}

interface Props<T> extends Omit<TableCardProps, "children"> {
  rowLoader?: React.ReactNode;
  items?: readonly T[];
  generateKey: (item: T) => string;
  emptyStateMessage?: string;
  Row?: React.FC<RowProps<T>>;
  children?: React.ReactNode;
}

const defaultRowLoader = (
  <tr>
    <td>
      <ContentLoader />
    </td>
  </tr>
);

export function TableCard<T>({
  items,
  rowLoader = defaultRowLoader,
  generateKey,
  emptyStateMessage = "There are no rows in this list.",
  children,
  Row,
  ...props
}: Props<T>) {
  return (
    <TableCardBody {...props}>
      {items === undefined ? (
        Array(3)
          .fill(null)
          .map(() => rowLoader)
      ) : items.length === 0 ? (
        <tr>
          <td colSpan={100}>
            <EmptyState className="w-full" title={emptyStateMessage} />
          </td>
        </tr>
      ) : Row ? (
        <>
          {items.map((item, i) => (
            <Row
              key={generateKey(item)}
              item={item}
              index={i}
              isLast={i === items.length - 1}
            />
          ))}
        </>
      ) : (
        children
      )}
    </TableCardBody>
  );
}

export default TableCard;