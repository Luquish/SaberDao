import { startCase } from "lodash-es";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import { ReactComponent as Rook } from "./Rook.svg";
import { SettingsModal } from "./SettingsModal";
import { WalletDropdown } from "./WalletDropdown";

interface Props {
  placeholder: boolean;
}

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  return {
    governor: paths[3] || '' 
  };
}

export const Header: React.FC<Props> = ({ placeholder }: Props) => {
  const location = useLocation();
  const { governor } = getParams(location.pathname);
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
