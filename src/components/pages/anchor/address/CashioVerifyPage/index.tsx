import { usePubkey } from "@rockooor/sail";
import { useParams } from "react-router-dom";

import { AnchorLayout } from "../../../../layout/AnchorLayout";
import { CashioUBOInfo } from "./CashioUBOInfo";

export const CashioVerifyPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const addressKey = usePubkey(address);

  return (
    <AnchorLayout title={`Cashio Account Verification for ${address ?? "--"}`}>
      {addressKey && <CashioUBOInfo ubo={addressKey} />}
    </AnchorLayout>
  );
};

export default CashioVerifyPage;
