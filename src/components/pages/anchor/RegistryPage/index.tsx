import tw from "twin.macro";

import { useWindowTitle } from "../../../../hooks/useWindowTitle";
import { SOLANA_EXPLORER_PROGRAMS } from "../../../../utils/explorerPrograms";
import { CommonHelmet } from "../../../common/CommonHelmet";
import { Card } from "../../../common/governance/Card";
import { AnchorLayout } from "../../../layout/AnchorLayout";

export const RegistryPage: React.FC = () => {
  useWindowTitle(`Registry | Anchor.so`);
  return (
    <AnchorLayout title="Registry" innerStyles={tw`max-w-3xl`}>
      <CommonHelmet
        title="Registry"
        description="Registry of known addresses"
      />
      <div tw="flex flex-col gap-8">
        <Card title="Registry (JSON)">
          <textarea>{JSON.stringify(SOLANA_EXPLORER_PROGRAMS)}</textarea>
        </Card>
      </div>
    </AnchorLayout>
  );
};

export default RegistryPage;
