import { startCase } from "lodash-es";
import { Link, useParams } from "react-router-dom";

import { useEnvironment } from "../../../../utils/useEnvironment";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import { ReactComponent as Rook } from "./Rook.svg";
import { SettingsModal } from "./SettingsModal";
import { WalletDropdown } from "./WalletDropdown";

interface Props {
  placeholder: boolean;
}

export const Header: React.FC<Props> = ({ placeholder }: Props) => {
  const { governor } = useParams<"governor">();
  const { network } = useEnvironment();
  return (
    <div tw="bg-warmGray-900 w-screen">
      <div tw="flex items-center justify-between h-20 mx-auto w-11/12 max-w-7xl">
        <div tw="flex items-center gap-4 z-20 md:z-auto">
          <Link to={`/gov/${governor ?? ""}`}>
            <div tw="text-white hover:(text-primary -rotate-3) transition-all">
              <Rook />
            </div>
          </Link>
          <div tw="hidden md:block">{!placeholder && <Nav />}</div>
        </div>
        <div tw="flex items-center">
          {network !== "mainnet-beta" && (
            <span tw="text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4 z-20 md:z-auto">
              {startCase(network)}
            </span>
          )}
          <WalletDropdown />

          {!placeholder && (
            <>
              <MobileNav tw="ml-4 md:hidden" />
              <SettingsModal tw="ml-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
