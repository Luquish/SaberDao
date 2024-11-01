import { useToken, useUserATAs } from "@rockooor/sail";
import { Link, useNavigate, useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { useSDK } from "../../../../../../contexts/sdk";
import {
  useLocker,
  useUserEscrow,
} from "../../../../../../hooks/tribeca/useEscrow";
import { useGovernor } from "../../../../../../hooks/tribeca/useGovernor";
import { Button } from "../../../../../common/Button";
import { ContentLoader } from "../../../../../common/ContentLoader";
import { Card } from "../../../../../common/governance/Card";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../../common/TokenIcon";
import { CardItem } from "./CardItem";
import { LockEscrowModal } from "./LockEscrowModal";

interface Props {
  className?: string;
}

export const EscrowInfo: React.FC<Props> = ({ className }: Props) => {
  const { lockerSubpage } = useParams<{ lockerSubpage: string }>();
  const { governor, path } = useGovernor();
  const { data: locker } = useLocker();
  const { data: govToken } = useToken(locker?.account.tokenMint);
  const [govTokenBalance] = useUserATAs(govToken);
  const { data: escrow, isLoading, govTokensLocked } = useUserEscrow();
  const { sdkMut } = useSDK();

  const navigate = useNavigate();
  const lockModalVariant =
    lockerSubpage === "lock" || lockerSubpage === "extend"
      ? lockerSubpage
      : null;
  const showModal = !!lockModalVariant;

  return (
    <Card className={className} title="Voting Wallet">
      <LockEscrowModal
        variant={lockModalVariant}
        escrowW={escrow ? escrow.escrowW : null}
        isOpen={showModal}
        onDismiss={() => navigate(`/gov/${governor.toString()}/locker`)}
      />
      <CardItem label={`${govToken?.symbol ?? "Token"} Balance`}>
        <div tw="flex items-center gap-2.5 h-7">
          {govTokenBalance ? (
            <TokenAmountDisplay
              amount={govTokenBalance.balance}
              showSymbol={false}
            />
          ) : (
            <div tw="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
          )}
          <TokenIcon size={18} token={govToken} />
        </div>
      </CardItem>
      <CardItem label={`Your ${govToken?.symbol ?? "Token"} Locked`}>
        <div tw="flex items-center gap-2.5 h-7">
          {govTokensLocked ? (
            <TokenAmountDisplay amount={govTokensLocked} showSymbol={false} />
          ) : (
            <ContentLoader tw="h-4 w-12" />
          )}
          <TokenIcon size={18} token={govToken} />
        </div>
      </CardItem>
      <div tw="px-7 py-4 flex gap-4">
        {!escrow && isLoading ? (
          <>
            <ButtonLoader />
            <ButtonLoader />
          </>
        ) : !sdkMut ? (
          <ButtonLoader />
        ) : (
          <>
            <OuterButtonContainer escrowExists={!!escrow}>
              <Link to={`${path}/locker/lock`} tw="flex-grow">
                <Button
                  tw="w-full hover:dark:text-primary hover:dark:border-primary"
                  type="button"
                  size="md"
                  variant="outline"
                >
                  Lock
                </Button>
              </Link>
            </OuterButtonContainer>
            {escrow && (
              <OuterButtonContainer escrowExists={true}>
                <Link to={`${path}/locker/extend`} tw="flex-grow">
                  <Button
                    tw="w-full hover:dark:text-primary hover:dark:border-primary"
                    type="button"
                    size="md"
                    variant="outline"
                  >
                    Extend
                  </Button>
                </Link>
              </OuterButtonContainer>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

interface OuterButtonContainerProps {
  children: React.ReactNode;
  escrowExists: boolean;
}

const OuterButtonContainer: React.FC<OuterButtonContainerProps> = ({
  children,
  escrowExists,
}: OuterButtonContainerProps) => {
  if (!escrowExists) {
    return <div tw="w-full">{children}</div>;
  }
  return <div tw="w-1/2">{children}</div>;
};

const ButtonLoader = styled.div`
  ${tw`w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]`}
`;
