import { startCase } from "lodash-es";
import { Link } from "react-router-dom";

import { useEnvironment } from "../../../utils/useEnvironment";
import { ReactComponent as AnchorLogo } from "../../pages/anchor/IndexPage/AnchorLogo.svg";
import { WalletDropdown } from "../GovernorLayout/Header/WalletDropdown";
import { AnchorWidthContainer } from "./AnchorWidthContainer";
import { InnerNav } from "./InnerNav";

export const Navbar: React.FC = () => {
  const { network } = useEnvironment();
  return (
    <nav tw="w-full py-3 bg-warmGray-850 border-b border-b-black">
      <AnchorWidthContainer tw="flex items-center justify-between">
        <Link to="/">
          <div tw="flex items-center gap-2">
            <AnchorLogo tw="h-8 w-8" />
            <h1 tw="hidden md:block text-white text-lg font-bold">Anchor.so</h1>
          </div>
        </Link>
        <div tw="flex items-center gap-4 md:gap-8">
          <InnerNav />
          <div tw="flex items-center">
            {network !== "mainnet-beta" && (
              <span tw="text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4 z-20 md:z-auto">
                {startCase(network)}
              </span>
            )}
            <WalletDropdown />
          </div>
        </div>
      </AnchorWidthContainer>
    </nav>
  );
};
