import { WalletButton } from "../layout/GovernorLayout/Header/WalletButton";
import { ReactComponent as SolanaIcon } from "../layout/WalletLayout/SolanaIcon.svg";
import React from 'react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon,
  title,
  children,
  className,
}: Props) => {
  return (
    <div
      className={`w-full py-12 text-sm flex flex-col items-center ${className}`}
    >
      {icon && (
        <div
          className="w-20 h-20 mb-3"
        >   
          {icon}
        </div>
      )}
      <div className="h-6">
        <span className="text-secondary dark:text-coolGray-300">{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export const EmptyStateConnectWallet: React.FC<Partial<Props>> = (
  props: Partial<Props>
) => {
  return (
    <EmptyState
      icon={<SolanaIcon />}
      title="Connect your wallet to view this page."
      {...props}
    >
      <div className="mt-4">
        <WalletButton />
      </div>
    </EmptyState>
  );
};
