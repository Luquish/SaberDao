import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { useWindowTitle } from "@/hooks/tribeca/useWindowTitle";
import { displayAddress } from "@/utils/tribeca/programs";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import { useTransaction } from "@/contexts/tribeca/transaction";
import Actions from "./Actions";
import InstructionCard from "./InstructionCard";
import TXActivity from "./TXActivity";
import TXSidebar from "./TXSidebar";

const TransactionIndexView: React.FC = () => {
  const { key } = useSmartWallet();
  const { network } = useEnvironment();
  const { instructions, txEnv, title, id } = useTransaction();

  useWindowTitle(`[${id}] ${title} - ${displayAddress(key.toString())} | SaberDAO`);

  return (
    <div className="flex w-full py-2">
      <div className="grid gap-4 flex-grow[2] flex-basis[760px]">
        <div className="w-full px-6 max-w-3xl mx-auto">
          <div className="pb-16">
            <h2 className="border-b pb-2 text-gray-500 font-semibold text-sm mb-4">
              <Link
                to={`/wallets/${key.toString()}/txs/all`}
                className="hover:underline"
              >
                Transactions
              </Link>{" "}
              › {id}
            </h2>
            <h1 className="font-medium text-2xl leading-relaxed my-4 py-2">{title}</h1>
            <Actions />
            <div className="grid gap-4">
              {instructions?.map((instruction, i) => (
                <InstructionCard
                  key={`ix_${i}`}
                  instruction={instruction}
                  index={i}
                />
              ))}
            </div>
          </div>
          <div className="pb-4 border-b">
            {txEnv && network !== "localnet" && (
              <div>
                <a
                  className="text-sm flex items-center gap-2 text-primary"
                  href={txEnv.generateInspectLink(network)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview on Anchor.so
                  <FaExternalLinkAlt />
                </a>
              </div>
            )}
          </div>
          <TXActivity />
        </div>
      </div>
      <div className="flex-grow[1] border-l px-6">
        <TXSidebar />
      </div>
    </div>
  );
};

export default TransactionIndexView;
