import React from "react";
import { Link } from "gatsby";
import { startCase } from "lodash-es";

import { CURRENT_APP } from "@/config";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import SaberIcon from "@/svg/Icon.svg";
import SaberLogo from "@/svg/logo-dark.svg";
import TribecaIcon from "@/svg/tribeca/favicon.svg";
import TribecaLogo from "@/svg/tribeca/logo.svg";
import WalletDropdown from "@/components/tribeca/layout/GovernorLayout/Header/WalletDropdown";
import MoreInfo from "./MoreInfo";

const Logo = CURRENT_APP === "tribeca" ? TribecaLogo : SaberLogo;
const Icon = CURRENT_APP === "tribeca" ? TribecaIcon : SaberIcon;

export default function Header() {
  const { network } = useEnvironment();
  return (
    <div className="relative flex items-center justify-between py-4 md:py-12">
      <div className="z-50 flex items-center">
        <div className="flex items-center">
          <Link
            to="/"
            className="hidden md:block h-6 w-36 hover:-rotate-3 transition-all"
          >
            <Logo className="text-primary-800 hover:text-primary dark:(text-primary hover:text-white) h-full w-full transition-colors" />
          </Link>
          <Link
            to="/"
            className="md:hidden h-10 hover:-rotate-3 transition-all"
          >
            <Icon className="text-primary-800 hover:text-primary dark:(text-primary hover:text-white) h-full w-full transition-colors" />
          </Link>
        </div>
      </div>

      <div className="flex justify-end items-center z-20 gap-4">
        {network !== "mainnet-beta" && (
          <span className="bg-accent px-3 py-0.5 text-xs rounded text-white font-medium">
            {startCase(network)}
          </span>
        )}
        <WalletDropdown />
        <MoreInfo />
      </div>
    </div>
  );
}
