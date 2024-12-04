import React, { useMemo } from "react";
import { Link, useParams } from "@reach/router";
import tw from "twin.macro";
import { useGovernor } from "@/hooks/governance/useGovernor";

const NavLink = tw(Link)`
  px-3 py-1 rounded text-sm font-semibold transition-colors 
  hover:text-white [&.active]:text-white [&.active]:bg-gray-800
`;

export const NAV_LINKS = [
  {
    title: "Overview",
    href: "/",
    exact: true,
  },
  {
    title: "Proposals",
    href: "/proposals",
  },
  {
    title: "Locker",
    href: "/locker",
  },
  {
    title: "Gauges",
    href: "/gauges",
  },
  {
    title: "Parameters",
    href: "/parameters",
  }
];

export const useNavLinks = () => {
  const { manifest } = useGovernor();
  return useMemo(
    () => [
      ...NAV_LINKS,
      ...(manifest?.saves
        ? [
            {
              title: "SAVEs",
              href: "/saves",
            },
          ]
        : []),
      ...(manifest?.nftLockerGauges
        ? manifest.nftLockerGauges.map((nftGauge) => {
            return {
              title: nftGauge.label + " Gauges",
              href: "/nftgauges/" + nftGauge.label.toLocaleLowerCase(),
            };
          })
        : []),
    ],
    [manifest]
  );
};

interface Props {
  className?: string;
}

export const Nav: React.FC<Props> = ({ className }: Props) => {
  const { governor = "" } = useParams();
  const navLinks = useNavLinks();
  
  return (
    <nav tw="flex gap-2" className={className}>
      {navLinks.map(({ title, href }) => (
        <NavLink
          key={href}
          to={`/governance/${governor}${href}`}
          getProps={({ isCurrent, isPartiallyCurrent }) => ({
            className: (href === "/" ? isCurrent : isPartiallyCurrent) ? "active" : ""
          })}
        >
          <div>{title}</div>
        </NavLink>
      ))}
    </nav>
  );
};
