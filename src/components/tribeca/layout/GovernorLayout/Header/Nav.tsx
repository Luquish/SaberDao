import { useMemo } from "react";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { getUrlParams } from "@/utils/tribeca/urlParams";

export const NAV_LINKS = [
  {
    title: "Overview",
    href: "/tribeca/gov/:governor/",
  },
  {
    title: "Proposals",
    href: "/tribeca/gov/:governor/proposals",
  },
  {
    title: "Locker",
    href: "/tribeca/gov/:governor/locker",
  },
]

interface NFTGauge {
    label: string;
}

export function useNavLinks() {
  const { manifest } = useGovernor();
  return useMemo(
    () => [
      ...NAV_LINKS,
      ...(manifest?.quarry?.gauge && !manifest?.quarry?.gauge.hidden
        ? [
            {
              title: "Gauges",
              href: "/tribeca/gov/:governor/gauges",
            },
          ]
        : []),
      ...(manifest?.saves
        ? [
            {
              title: "SAVEs",
              href: "/tribeca/gov/:governor/saves",
            },
          ]
        : []),
      ...(manifest?.nftLockerGauges
        ? manifest.nftLockerGauges.map((nftGauge: NFTGauge) => {
            return {
              title: nftGauge.label + " Gauges",
              href: `/tribeca/gov/:governor/nftgauges/${nftGauge.label.toLocaleLowerCase()}`,
            };
          })
        : []),
      {
        title: "Parameters",
        href: "/tribeca/gov/:governor/details",
      },
    ],
    [manifest]
  );
}

interface Props {
  className?: string;
}

export function Nav({ className }: Props) {
  const location = useLocation();
  const governor = getUrlParams.governor(location.pathname);
  const navLinks = useNavLinks();
  
  return (
    <nav className={clsx("flex gap-2", className)}>
      {navLinks.map(({ title, href }) => (
        <Link
          key={href}
          to={href.replace(':governor', governor ?? '')}
          className={clsx(
            "px-3 py-1 rounded text-sm font-semibold transition-colors",
            "hover:text-white",
            "active:text-white active:bg-warmGray-800"
          )}
          getProps={({ isCurrent }) => ({
            className: isCurrent ? "active" : ""
          })}
        >
          <div>{title}</div>
        </Link>
      ))}
    </nav>
  );
}
