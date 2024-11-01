import { GOKI_ADDRESSES } from "@gokiprotocol/client";
import type { PublicKey } from "@solana/web3.js";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import invariant from "tiny-invariant";

import { useProvider } from "../../../hooks/useProvider";
import { getGPAConnection } from "../../../utils/gpaConnection";
import { displayAddress } from "../../../utils/programs";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { WalletButton } from "../../layout/GovernorLayout/Header/WalletButton";

const AMOUNT_OFFSET_BYTES = 8 + 32 + 1 + 8 + 8 + 8 + 4 + 8 + 4;

export const UserView: React.FC = () => {
  const { network, providerMut } = useProvider();
  const userKey = providerMut?.wallet.publicKey;
  const wallets = useQueries({
    queries: Array(3)
      .fill(null)
      .map((_, i) => ({
        queryKey: ["walletsForUser", network, userKey?.toString(), i],
        queryFn: async () => {
          invariant(userKey, "userKey");
          // https://github.com/solana-labs/solana/blob/master/cli/src/program.rs#L1142
          const result = await getGPAConnection({ network }).getProgramAccounts(
            GOKI_ADDRESSES.SmartWallet,
            {
              filters: [
                {
                  memcmp: {
                    offset: AMOUNT_OFFSET_BYTES + i * 32,
                    bytes: userKey.toString(),
                  },
                },
              ],
            }
          );
          return result.map((r) => r.pubkey);
        },
        enabled: !!userKey,
      })),
  });

  const allWallets = wallets
    .flatMap((w) => w.data)
    .filter((k): k is PublicKey => !!k);
  return (
    <div tw="w-11/12 max-w-sm">
      <h1 tw="font-bold text-3xl mb-4">Wallets</h1>
      <div tw="prose prose-sm mb-4">
        <p>This is a list of the wallets you are a signer on.</p>
        <p>
          If you are not one of the first few signers on the wallet, your wallet
          may not show up here. In that case, please visit the wallet's page
          directly.
        </p>
      </div>
      {allWallets.length === 0 &&
        (wallets.find((w) => w.isLoading) ? (
          <LoadingSpinner />
        ) : (
          <div tw="p-4 rounded border bg-gray-50 text-sm flex flex-col items-center gap-4">
            {providerMut ? (
              <>
                <p>No wallets found.</p>
                <span>
                  Would you like to{" "}
                  <Link to="/onboarding/new">create a wallet</Link>?
                </span>
              </>
            ) : (
              <>
                <p>Connect your wallet to view your Goki smart wallets.</p>
                <WalletButton />
              </>
            )}
          </div>
        ))}
      <div tw="flex flex-col gap-2">
        {allWallets.map((wallet) => {
          return (
            <div tw="p-4 rounded border bg-gray-50" key={wallet.toString()}>
              <Link
                tw="text-sm font-semibold"
                to={`/wallets/${wallet.toString()}`}
              >
                {displayAddress(wallet.toString())}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserView;
