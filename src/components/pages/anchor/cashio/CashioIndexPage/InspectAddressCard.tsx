import { usePubkey } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { useAllCashioUBOs } from "../../address/CashioVerifyPage/useCashioHackUBOInfo";

export const InspectAddressCard: React.FC = () => {
  const { data: allUBOs } = useAllCashioUBOs();
  const [address, setAddress] = useState<string>("");
  const validAddress = usePubkey(address);
  const uboInfo = mapSome(allUBOs, (all) =>
    mapSome(validAddress, (v) =>
      v.toString() in all ? all[v.toString()] : null
    )
  );

  return (
    <div>
      <InputText
        placeholder="Enter a public key..."
        tw="w-full"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />
      {validAddress && (
        <div tw="mt-4 p-4 border border-warmGray-700 rounded">
          {uboInfo && (
            <>
              <div tw="mb-4 text-white">
                Found {Object.keys(uboInfo).length} token accounts associated
                with this address.
              </div>
              <Link to={`/address/${validAddress.toString()}/cashio`}>
                <Button variant="primary">View Details</Button>
              </Link>
            </>
          )}
          {uboInfo === null && (
            <span>
              We couldn't find any CASH or CASH derivative accounts associated
              with this address.
            </span>
          )}
          {uboInfo === undefined && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
};
