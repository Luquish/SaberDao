import { AnchorProvider, Program, utils } from "@project-serum/anchor";
import { useToken } from "@rockooor/sail";
import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { SignerWallet } from "@saberhq/solana-contrib";
import { TokenAmount } from "@saberhq/token-utils";
import type { ConfirmedTransactionMeta } from "@solana/web3.js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { BN } from "bn.js";
import tw from "twin.macro";

import type { ChestIDL } from "../../../../../idls/chest";
import { ChestJSON } from "../../../../../idls/chest";
import {
  CASH_MINT,
  CASH_MINT_STRING,
  CHEST_PROGRAM_ID,
} from "../../../../../utils/constants";
import { NamedAddressLink } from "../../../../common/account/NamedAddressLink";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { SLOT_OF_HACK } from "./useBalanceAtTimeOfHack";
import type { CashioHackedAccountType } from "./useCashioHackUBOInfo";

const CASH_INDEX = 5;

type ChestProgramTypes = AnchorTypes<
  ChestIDL,
  {
    user: ChestUser;
  }
>;

type ChestUser = ChestProgramTypes["Accounts"]["User"];

const findChestUserPDAKey = async (userAuthority: PublicKey) => {
  const [key] = await PublicKey.findProgramAddress(
    [userAuthority.toBuffer(), utils.bytes.utf8.encode("userv1")],
    CHEST_PROGRAM_ID
  );
  return key;
};

interface Props {
  ubo: PublicKey;
}

export const ChestBalance: React.FC<Props> = ({ ubo }: Props) => {
  const { data: cash } = useToken(CASH_MINT);
  const { data: chestPDA } = useQuery({
    queryKey: ["chestBalance", ubo.toString()],
    queryFn: async () => {
      const userPDAKey = await findChestUserPDAKey(ubo);

      return {
        account: userPDAKey,
        type: "chest-vault" as CashioHackedAccountType,
        owner: ubo,
      };
    },
  });

  const { data: totalChestBal } = useQuery({
    queryKey: ["chestBalance", chestPDA?.account.toString(), cash?.address],
    queryFn: async () => {
      if (cash === undefined || chestPDA === undefined) {
        return undefined;
      }
      if (cash === null || chestPDA === null) {
        return null;
      }

      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const { account } = chestPDA;

      const anchorProvider = new AnchorProvider(
        connection,
        new SignerWallet(Keypair.generate()),
        {
          commitment: "confirmed",
        }
      );

      const chestProgram = new Program(
        ChestJSON,
        CHEST_PROGRAM_ID,
        anchorProvider
      ) as unknown as ChestProgramTypes["Program"];
      const userPDAInfo = await chestProgram.account.user.fetchNullable(
        account
      );

      if (!userPDAInfo) {
        return null;
      }

      const signatures = await connection.getSignaturesForAddress(
        account,
        {},
        "confirmed"
      );

      const relevantSignatures = signatures.filter(
        (s) => s.slot > SLOT_OF_HACK
      );
      const withdrawTxMeta = await Promise.all(
        relevantSignatures.map(async ({ signature }) => {
          const resp = await connection.getTransaction(signature);
          if (resp?.meta?.logMessages?.join("").includes("withdraw")) {
            return resp.meta;
          }
          return null;
        })
      );
      const withdrawnAmount = withdrawTxMeta
        .filter((meta): meta is ConfirmedTransactionMeta => !!meta)
        .reduce((acc, meta) => {
          const preTokenBalance = new TokenAmount(
            cash,
            meta.preTokenBalances?.find(
              (pre) =>
                pre.owner === ubo.toString() && pre.mint === CASH_MINT_STRING
            )?.uiTokenAmount.amount ?? "0"
          );
          const postTokenBalance = new TokenAmount(
            cash,
            meta.postTokenBalances?.find(
              (post) =>
                post.owner === ubo.toString() && post.mint === CASH_MINT_STRING
            )?.uiTokenAmount.amount ?? "0"
          );
          const diff = postTokenBalance.subtract(preTokenBalance);
          return acc.add(diff);
        }, new TokenAmount(cash, "0"));

      const startAmount = userPDAInfo.startAmount[CASH_INDEX] ?? new BN(0);
      const lockedAmount = userPDAInfo.lockedAmount[CASH_INDEX] ?? new BN(0);
      return withdrawnAmount.add(
        new TokenAmount(cash, startAmount.add(lockedAmount))
      );
    },
  });

  return (
    <tr>
      <td>
        <div tw="flex flex-col gap-1">
          {!chestPDA && <LoadingSpinner />}
          {chestPDA && (
            <>
              <NamedAddressLink
                address={chestPDA.account}
                shorten={false}
                showCopy
              />
              <span>{chestPDA.type}</span>
            </>
          )}
        </div>
      </td>
      <td>
        {totalChestBal && (
          <TokenAmountDisplay
            amount={totalChestBal}
            showIcon
            css={[
              totalChestBal && totalChestBal.isNonZero() && tw`text-white`,
              totalChestBal &&
                totalChestBal.greaterThan("1") &&
                tw`font-semibold`,
            ]}
          />
        )}
        {totalChestBal === undefined && <LoadingSpinner />}
        {totalChestBal === null && <span>N/A</span>}
      </td>
      <td>
        <span>N/A</span>
      </td>
      <td>
        <span>N/A</span>
      </td>
    </tr>
  );
};
