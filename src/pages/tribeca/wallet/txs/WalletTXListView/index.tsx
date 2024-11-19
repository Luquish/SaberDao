import React from "react";
import { GiTumbleweed } from "react-icons/gi";
import { Link, PageProps } from "gatsby";

import type { ParsedTX } from "@/hooks/tribeca/useSmartWallet";
import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { Button } from "@/components/tribeca/common/Button";
import { EmptyState } from "@/components/tribeca/common/EmptyState";
import IXSummary from "@/components/tribeca/common/governance/IXSummary";

interface TXList {
  title: string;
  filter?: (tx: ParsedTX) => boolean;
}

type WalletTXListViewProps = {
    location: PageProps['location'];
  }

const LISTS = {
  all: {
    title: "All Transactions",
  },
  pending: {
    title: "Pending Transactions",
    filter: (tx: ParsedTX) => tx.tx?.account.executedAt.isNeg() ?? false,
  },
  executed: {
    title: "Executed Transactions",
    filter: (tx: ParsedTX) => !tx.tx?.account.executedAt.isNeg() ?? false,
  },
};

const WalletTXListView: React.FC<WalletTXListViewProps> = ({ location }) => {
    const listId = (location?.pathname?.split('/')?.pop() as keyof typeof LISTS) ?? "all";
    const list: TXList = LISTS[listId];
    const { path, parsedTXs: allParsedTXs, key, threshold } = useSmartWallet();

  const parsedTXs = list.filter
    ? allParsedTXs?.filter(list.filter)
    : allParsedTXs;

  return (
    <div className="w-full">
      <div className="h-[57px] w-full flex items-center justify-between px-6 text-sm border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-gray-800 font-medium">{list.title}</h1>
          <span className="text-secondary">{parsedTXs?.length}</span>
        </div>
        <Link to={`${path}/propose`}>
          <Button>Propose Transaction</Button>
        </Link>
      </div>
      {parsedTXs?.length === 0 && (
        <div 
          className="flex items-center justify-center"
          style={{ height: "calc(80vh - 57px)" }}
        >
          <EmptyState
            icon={<GiTumbleweed />}
            title={`No ${
              listId === "all"
                ? " transactions"
                : list.title.toLocaleLowerCase()
            }.`}
          >
            <Link className="text-primary" to={`${path}/propose`}>
              Propose a transaction
            </Link>
          </EmptyState>
        </div>
      )}
      <div>
        {parsedTXs?.map(({ tx, index, instructions }, i) => {
          const numSigned = ((tx?.account.signers ?? []) as boolean[]).filter(
            (x) => !!x
          ).length;
          return (
            <Link
              key={`tx_${index ?? `unknown_${i}`}`}
              to={`/wallets/${key.toString()}/tx/${
                tx?.account.index.toNumber() ?? ""
              }`}
              className="h-[44px] flex items-center justify-between px-6 text-sm w-full hover:bg-gray-50 border-b"
            >
              <div className="flex items-center gap-4">
                <div className="text-gray-500">TX-{tx?.account.index.toNumber()}</div>
                <div className="text-gray-800 font-medium">
                  <div className="inline-flex">
                    {instructions?.map(({ ix }, i) => (
                      <React.Fragment key={i}>
                        <IXSummary instruction={ix} />
                        {i !== instructions.length - 1 && <>,&nbsp;</>}
                      </React.Fragment>
                    )) ?? "--"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-gray-500">
                  {numSigned} / {threshold} Sigs
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WalletTXListView;
