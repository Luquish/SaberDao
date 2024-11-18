import { startCase } from "lodash-es";
import { AiOutlineBank } from "react-icons/ai";
import { FaCode, FaInbox, FaWrench } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";

import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { ReactComponent as GokiLogo } from "@/components/tribeca/common/svgs/logo-dark.svg";
import { WalletDropdownMini } from "../WalletDropdownMini";
import { SidebarNavLink } from "./SidebarNavLink";

const MAIN_LINKS = [
  {
    icon: <FaInbox />,
    title: "Inbox",
    href: "/inbox",
  },
  {
    icon: <AiOutlineBank />,
    title: "Treasury",
    href: "/treasury",
  },
  {
    icon: <FaCode />,
    title: "Programs",
    href: "/programs",
  },
  {
    icon: <FaWrench />,
    title: "Settings",
    href: "/settings",
  },
];

const NAV_LINKS = [
  {
    title: "All",
    href: "/txs/all",
  },
  {
    title: "Pending",
    href: "/txs/pending",
  },
  {
    title: "Executed",
    href: "/txs/executed",
  },
];

const APPS: { title: string; href: string }[] = [
  // {
  //   title: "✌️ Venko",
  //   href: "/apps/venko",
  // },
];

export const Sidebar: React.FC = () => {
  const { key, path } = useSmartWallet();
  const { network } = useEnvironment();
  return (
    <nav className="w-[220px] max-w-[330px] h-screen border-r flex flex-col justify-between flex-grow-0 flex-shrink-0">
      <div>
        <div className="px-5 py-3 grid gap-7">
          <div className="flex items-center justify-between">
            <Link to={path}>
              <GokiLogo className="h-5 w-min text-primary-800 hover:(text-primary -rotate-3) transition-all" />
            </Link>
            {network !== "mainnet-beta" && (
              <span className="bg-accent-500 text-white px-3 py-0.5 rounded text-xs">
                {startCase(network)}
              </span>
            )}
          </div>
          <div className="border rounded px-3 py-2 text-sm flex items-center gap-1">
            <span>Wallet:</span>
            <AddressLink
              className="font-semibold"
              address={key}
              showCopy
              showRaw={false}
            />
          </div>
        </div>
        <div className="flex flex-col px-4 mb-0.5 gap-7">
          <div className="flex flex-col">
            {MAIN_LINKS.map(({ title, href, icon }) => {
              return (
                <SidebarNavLink
                  key={href}
                  to={`/wallets/${key.toString()}${href}`}
                  className="px-2"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    {title}
                  </div>
                </SidebarNavLink>
              );
            })}
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-medium text-gray-500 mb-1 px-2">
              Transactions
            </h3>
            {NAV_LINKS.map(({ title, href }) => {
              return (
                <SidebarNavLink
                  key={href}
                  to={`/wallets/${key.toString()}${href}`}
                >
                  {title}
                </SidebarNavLink>
              );
            })}
          </div>
          {APPS.length > 0 && (
            <div className="flex flex-col">
              <h3 className="text-xs font-medium text-gray-500 mb-1 px-2">
                Apps
              </h3>
              {APPS.map(({ title, href }) => {
                return (
                  <SidebarNavLink
                    key={href}
                    to={`/wallets/${key.toString()}${href}`}
                  >
                    {title}
                  </SidebarNavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="px-5 py-3 mb-3">
        <WalletDropdownMini />
      </div>
    </nav>
  );
};
