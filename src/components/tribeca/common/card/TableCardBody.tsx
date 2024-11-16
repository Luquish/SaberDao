import React from "react";

export interface Props {
  head?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  rightAlignEnd?: boolean;
}

export const TableCardBody: React.FC<Props> = ({
  head,
  children,
  className,
  rightAlignEnd = false,
}: Props) => {
  return (
    <div className="mb-0 w-full">
      <table
        className={`whitespace-nowrap w-full text-sm ${className} 
          [&_th:first-of-type]:pl-7 [&_td:first-of-type]:pl-7 [&_th:first-of-type]:text-white [&_td:first-of-type]:text-white
          [&_th:last-child]:pr-7 [&_td:last-child]:pr-7
          [&_th]:text-left
          ${rightAlignEnd ? '[&_td:last-child]:text-right [&_th:last-child]:text-right [&_td:last-child>*]:inline-block [&_th:last-child>*]:inline-block' : ''}`}
      >
        {head && (
          <thead className="[&_th]:text-left [&_th]:align-middle [&_th]:p-4 [&_th]:text-white [&_th]:font-semibold">
            {head}
          </thead>
        )}
        <tbody className={`[&_th]:align-middle [&_td]:align-middle [&_th]:p-4 [&_td]:p-4 
          [&_th]:border-t [&_td]:border-t [&_th]:border-t-warmGray-800 [&_td]:border-t-warmGray-800
          ${!head ? '[&_tr:first-of-type_th]:border-none [&_tr:first-of-type_td]:border-none' : ''}`}>
          {children}
        </tbody>
      </table>
    </div>
  );
};
