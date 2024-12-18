import type { PublicKey } from "@solana/web3.js";
import { GiTumbleweed } from "react-icons/gi";

import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { EmptyState } from "@/components/tribeca/common/EmptyState";

import React from "react";

interface Props {
  smartWallet: PublicKey;
}

export default function NoPrograms({ smartWallet }: Props) {
  return (
    <>
      <EmptyState
        icon={<GiTumbleweed />}
        title="This DAO doesn't own any programs."
      >
        <div className="text-center">
          <p>
            The DAO at address <AddressLink address={smartWallet} showCopy />{" "}
            does not own any programs.
          </p>
          <p>
            <a
              className="text-primary"
              href="https://docs.solana.com/cli/deploy-a-program#set-a-programs-upgrade-authority"
              target="_blank"
              rel="noreferrer"
            >
              Read the Solana Wiki to learn more about upgrade authorities.
            </a>
          </p>
        </div>
      </EmptyState>
    </>
  );
}
