import type { AnchorHTMLAttributes, ClassAttributes } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";

type Props = ClassAttributes<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    noIcon?: boolean;
    icon?: React.ReactNode;
  };

export const ExternalLink = ({
  children,
  noIcon = false,
  icon,
  ...anchorProps
}: Props) => {
  return (
    <a
      tw="text-sm text-primary hover:text-white transition-colors"
      target="_blank"
      rel="noreferrer"
      {...anchorProps}
    >
      {children}
      {!noIcon &&
        (icon ?? (
          <FaExternalLinkAlt tw="ml-2 inline vertical-align[baseline] h-[0.8em] w-[0.8em]" />
        ))}
    </a>
  );
};

export const InternalLink = styled(Link)`
  ${tw`text-sm flex items-center gap-2 text-primary hover:text-white transition-colors`}
`;
