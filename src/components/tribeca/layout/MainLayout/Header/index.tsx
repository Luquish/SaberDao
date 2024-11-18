import { startCase } from "lodash-es";
import React from "react";
import { Link } from "gatsby";

import { CURRENT_APP } from "@/config";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { ReactComponent as SaberIcon } from "@/components/tribeca/common/svgs/Icon.svg";
import { ReactComponent as SaberLogo } from "@/components/tribeca/common/svgs/logo-dark.svg";
import { ReactComponent as TribecaIcon } from "@/components/tribeca/common/svgs/tribeca/favicon.svg";
import { ReactComponent as TribecaLogo } from "@/components/tribeca/common/svgs/tribeca/logo.svg";
import { WalletDropdown } from "@/components/tribeca/layout/GovernorLayout/Header/WalletDropdown";
import { MoreInfo } from "./MoreInfo";

const Logo = CURRENT_APP === "tribeca" ? TribecaLogo : SaberLogo;
const Icon = CURRENT_APP === "tribeca" ? TribecaIcon : SaberIcon;

export const Header: React.FC = () => {
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
};
