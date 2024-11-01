import { GOKI_ADDRESSES } from "@gokiprotocol/client";
import { useAccountData, usePubkey } from "@rockooor/sail";
import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import { useParams } from "react-router-dom";

import { useIDL } from "../../../../hooks/useIDLs";
import { BPF_UPGRADEABLE_LOADER_ID } from "../../../../utils/instructions/upgradeable_loader/instructions";
import { ContentLoader } from "../../../common/ContentLoader";
import { Card } from "../../../common/governance/Card";
import { AnchorLayout } from "../../../layout/AnchorLayout";
import { AnchorDataCard } from "./AnchorDataCard/AnchorDataCard";
import { BPFUpgradeableLoaderAccountInfo } from "./BPFUpgradeableLoaderAccountInfo";
import { GokiTransactionInfo } from "./GokiTransactionInfo";
import { OverviewCard } from "./OverviewCard";
import { TokenProgramAccountInfo } from "./TokenProgramAccountInfo";

export const AddressPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const addressKey = usePubkey(address);
  const { data } = useAccountData(addressKey);
  const owner = data?.accountInfo.owner;
  const { data: ownerIDL } = useIDL(owner);

  return (
    <AnchorLayout title="Account">
      {data ? (
        <div tw="flex flex-col gap-8">
          <OverviewCard account={data} />
          {owner?.equals(GOKI_ADDRESSES.SmartWallet) && (
            <GokiTransactionInfo address={data.accountId} />
          )}
          {ownerIDL?.idl && (
            <AnchorDataCard account={data} idl={ownerIDL.idl} />
          )}
          {owner?.equals(BPF_UPGRADEABLE_LOADER_ID) && (
            <BPFUpgradeableLoaderAccountInfo data={data} />
          )}
          {owner?.equals(TOKEN_PROGRAM_ID) && (
            <TokenProgramAccountInfo data={data} />
          )}
        </div>
      ) : data === undefined ? (
        <Card title="Account">
          <div tw="px-8 py-5">
            <ContentLoader tw="h-8 w-40" />
          </div>
        </Card>
      ) : (
        <Card title="Not found">
          <p>
            Account <code>{address}</code> not found.
          </p>
        </Card>
      )}
    </AnchorLayout>
  );
};

export default AddressPage;
