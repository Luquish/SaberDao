import type { AnchorHTMLAttributes, ClassAttributes } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "gatsby";
import type { GatsbyLinkProps } from "gatsby";
import React from "react";
import clsx from "clsx";

type Props = ClassAttributes<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    noIcon?: boolean;
    icon?: React.ReactNode;
  };

export const ExternalLink = ({
  children,
  noIcon = false,
  icon,
  className,
  ...anchorProps
}: Props) => {
  return (
    <a
      className={clsx(
        "text-sm text-primary hover:text-white transition-colors",
        className
      )}
      target="_blank"
      rel="noreferrer"
      {...anchorProps}
    >
      {children}
      {!noIcon &&
        (icon ?? (
          <FaExternalLinkAlt className="ml-2 inline align-baseline h-[0.8em] w-[0.8em]" />
        ))}
    </a>
  );
};

export const InternalLink = ({
  children,
  className,
  ...props
}: Omit<GatsbyLinkProps<any>, 'ref'>) => {
  return (
    <Link
      className={clsx(
        "text-sm flex items-center gap-2 text-primary hover:text-white transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
