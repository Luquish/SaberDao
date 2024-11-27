import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";

import { useGovernor } from "@/hooks/governance/useGovernor";

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
  // {
  //   title: "Boost",
  //   href: "/boost",
  // },
  // {
  //   title: "Payouts",
  //   href: "/payouts",
  // },
];

export const useNavLinks = () => {
  const { manifest } = useGovernor();
  return useMemo(
    () => [
      ...NAV_LINKS,
      ...(manifest?.quarry?.gauge && !manifest?.quarry?.gauge.hidden
        ? [
            {
              title: "Gauges",
              href: "/gauges",
            },
          ]
        : []),
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
      {
        title: "Parameters",
        href: "/details",
      },
    ],
    [manifest]
  );
};

interface Props {
  className?: string;
}

export const Nav: React.FC<Props> = ({ className }: Props) => {
  const { governor } = useParams<"governor">();
  const navLinks = useNavLinks();
  return (
    <nav tw="flex gap-2" className={className}>
      {navLinks.map(({ title, href }) => (
        <NavLink
          key={href}
          to={`/gov/${governor ?? ""}${href}`}
          className={({ isActive }) => (isActive ? "active" : "")}
          tw={[
            'px-3 py-1 rounded text-sm font-semibold transition-colors hover:text-white [&.active]:text-white [&.active]:bg-warmgray-800'
          ].join(' ')}
        >
          <div>{title}</div>
        </NavLink>
      ))}
    </nav>
  );
};
