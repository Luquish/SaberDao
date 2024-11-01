import type { RewarderData } from "@quarryprotocol/quarry-sdk";
import {
  useMintWrapperData,
  useOperatorData,
  useRewarderConfig,
} from "@rockooor/react-quarry";
import { useToken } from "@rockooor/sail";
import type { ProgramAccount } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import BN from "bn.js";

import { useEnvironment } from "../../../../../../../utils/useEnvironment";
import { TokenIcon } from "../../../../../../common/TokenIcon";

interface Props {
  rewarder: ProgramAccount<RewarderData>;
}

export const RewarderCard: React.FC<Props> = ({ rewarder }: Props) => {
  const { data: rewarderConfig } = useRewarderConfig(
    rewarder.publicKey.toString()
  );
  const rewarderInfo = rewarderConfig?.info;
  const { data: rewardsToken } = useToken(
    rewarderConfig?.info?.redeemer?.underlyingToken ??
      rewarderConfig?.rewardsToken.mint
  );
  const dailyRewardsRate = rewardsToken
    ? new TokenAmount(
        rewardsToken,
        rewarder.account.annualRewardsRate.div(new BN(365))
      )
    : rewardsToken;
  const { network } = useEnvironment();

  const rewarderLink = `https://${
    network === "mainnet-beta"
      ? "app"
      : network === "devnet"
      ? "devnet"
      : network === "testnet"
      ? "testnet"
      : "app"
  }.quarry.so/#/rewarders/${rewarder.publicKey.toString()}/quarries`;

  const { data: mintWrapperData } = useMintWrapperData(
    rewarder.account.mintWrapper
  );
  const { data: operatorData } = useOperatorData(rewarder.account.authority);

  return (
    <tr>
      <td>
        <h3>
          <a href={rewarderLink} target="_blank" rel="noreferrer">
            {rewarderInfo?.name ?? rewarder.publicKey.toString()}
          </a>
        </h3>
        <span>
          {rewarderConfig?.quarries.length.toLocaleString() ?? "--"} quarries
        </span>
      </td>
      <td>
        <div tw="flex items-center gap-4">
          <TokenIcon token={rewardsToken} />
          <div tw="flex flex-col">
            <span tw="text-white">
              {dailyRewardsRate?.formatUnits() ?? "--"}/day
            </span>
            <span>{rewardsToken?.name}</span>
          </div>
        </div>
      </td>
      <td>
        <ul>
          <li>
            Mint Wrapper Authority: {mintWrapperData?.account.admin.toString()}
          </li>
          <li>Operator Admin: {operatorData?.account.admin.toString()}</li>
          <li>
            Quarry Creator: {operatorData?.account.quarryCreator.toString()}
          </li>
          <li>
            Share Allocator: {operatorData?.account.shareAllocator.toString()}
          </li>
          <li>Rate Setter: {operatorData?.account.rateSetter.toString()}</li>
        </ul>
      </td>
    </tr>
  );
};
