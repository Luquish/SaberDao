import {
  deserializeAccount,
  MintLayout,
  TokenAccountLayout,
} from "@saberhq/token-utils";
import type { KeyedAccountInfo } from "@solana/web3.js";

import { TokenAccountInfo } from "./TokenAccountInfo";

interface Props {
  data: KeyedAccountInfo;
}
export const TokenProgramAccountInfo: React.FC<Props> = ({ data }: Props) => {
  if (data.accountInfo.data.length === TokenAccountLayout.span) {
    const tokenAccount = deserializeAccount(data.accountInfo.data);
    return <TokenAccountInfo raw={data} data={tokenAccount} />;
  } else if (data.accountInfo.data.length === MintLayout.span) {
    // const mintInfo = deserializeMint(data.accountInfo.data);
    return <></>;
  }

  return <></>;
};
