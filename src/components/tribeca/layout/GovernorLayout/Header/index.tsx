import { startCase } from "lodash-es";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import MobileNav from "@/components/tribeca/layout/GovernorLayout/Header/MobileNav";
import { Nav } from "@/components/tribeca/layout/GovernorLayout/Header/Nav";
import Rook from "@/components/tribeca/layout/GovernorLayout/Header/Rook.svg";
import SettingsModal from "@/components/tribeca/layout/GovernorLayout/Header/SettingsModal";
import WalletDropdown from "@/components/tribeca/layout/GovernorLayout/Header/WalletDropdown";
import { getUrlParams } from "@/utils/tribeca/urlParams";

interface Props {
  placeholder: boolean;
}

export default function Header({ placeholder }: Props) {
  const location = useLocation();
  const governor = getUrlParams.governor(location.pathname);
  const { network } = useEnvironment();
  
  return (
    <div className="bg-warmGray-900 w-screen">
      <div className="flex items-center justify-between h-20 mx-auto w-11/12 max-w-7xl">
        <div className="flex items-center gap-4 z-20 md:z-auto">
          <Link to={`/gov/${governor ?? ""}`}>
            <div className="text-white hover:(text-primary -rotate-3) transition-all">
              <Rook />
            </div>
          </Link>
          <div className="hidden md:block">{!placeholder && <Nav />}</div>
        </div>
        <div className="flex items-center">
          {network !== "mainnet-beta" && (
            <span className="text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4 z-20 md:z-auto">
              {startCase(network)}
            </span>
          )}
          <WalletDropdown />

          {!placeholder && (
            <>
              <MobileNav className="ml-4 md:hidden" />
              <SettingsModal className="ml-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
