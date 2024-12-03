import React from 'react';
import { Link } from "react-router-dom";

import { CardErrorBoundary } from "../CardErrorBoundary";

interface Props {
  className?: string;
  title?: React.ReactNode;
  titleStyles?: React.CSSProperties;
  children?: React.ReactNode;
  link?: {
    title: string;
    href?: string;
  };
  /**
   * Whether or not to add padding to the card's body.
   */
  padded?: boolean;
  bodyScrollX?: boolean;
}

export const Card: React.FC<Props> = ({
  className,
  title,
  titleStyles,
  children,
  link,
  padded = false,
  bodyScrollX = false,
}: Props) => {
  return (
    <div
      className={className}
      tw="rounded bg-gray-800 shadow-xl flex flex-col"
    >
      {title && (
        <div
          tw="h-16 flex items-center px-7 w-full text-white font-bold tracking-tight border-b border-gray-800"
          style={titleStyles}
        >
          {typeof title === "string" ? <h2>{title}</h2> : title}
        </div>
      )}
      <CardErrorBoundary>
        <div
          tw={[
            padded && 'px-7 py-4',
            bodyScrollX && 'overflow-x-auto'
          ].filter(Boolean).join(' ')}
        >
          {children}
        </div>
      </CardErrorBoundary>
      {link &&
        (link.href ? (
          <Link to={link.href} tw="text-white hover:text-gray-50">
            <div tw="flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-gray-800">
              {link.title}
            </div>
          </Link>
        ) : (
          <div tw="flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-gray-800 text-gray-600 cursor-not-allowed">
            {link.title}
          </div>
        ))}
    </div>
  );
};
