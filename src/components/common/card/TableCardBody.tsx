import React from "react";
import tw, { css } from "twin.macro";

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
    <div tw="mb-0 w-full">
      <table
        tw="whitespace-nowrap w-full text-sm"
        css={css`
          th:first-of-type,
          td:first-of-type {
            ${tw`pl-7 text-white`}
          }
          th:last-child,
          td:last-child {
            ${tw`pr-7`}
          }
          th {
            ${tw`text-left`}
          }
          ${rightAlignEnd &&
          css`
            td:last-child,
            th:last-child {
              ${tw`text-right`}
              & > {
                ${tw`inline-block`}
              }
            }
          `}
        `}
        className={className}
      >
        {head && (
          <thead
            css={css`
              th {
                ${tw`text-left align-middle p-4`}
                ${tw`text-white font-semibold`}
              }
            `}
          >
            {head}
          </thead>
        )}
        <tbody
          css={css`
            th,
            td {
              ${tw`align-middle p-4 border-t border-t-warmGray-800`}
            }
            tr:first-of-type {
              th,
              td {
                ${!head && tw`border-none`}
              }
            }
          `}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
};
