import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useSmartWallet } from "../../../../../../hooks/useSmartWallet";
import { useWindowTitle } from "../../../../../../hooks/useWindowTitle";
import { displayAddress } from "../../../../../../utils/programs";
import { useEnvironment } from "../../../../../../utils/useEnvironment";
import { useTransaction } from "../context";
import { Actions } from "./Actions";
import { InstructionCard } from "./InstructionCard";
import { TXActivity } from "./TXActivity";
import { TXSidebar } from "./TXSidebar";

export const TransactionIndexView: React.FC = () => {
  const { key } = useSmartWallet();
  const { network } = useEnvironment();
  const { instructions, txEnv, title, id } = useTransaction();

  useWindowTitle(`[${id}] ${title} - ${displayAddress(key.toString())} | Goki`);

  return (
    <div tw="flex w-full py-2">
      <div tw="grid gap-4 flex-grow[2] flex-basis[760px]">
        <div tw="w-full px-6 max-w-3xl mx-auto">
          <div tw="pb-16">
            <h2 tw="border-b pb-2 text-gray-500 font-semibold text-sm mb-4">
              <Link
                to={`/wallets/${key.toString()}/txs/all`}
                tw="hover:underline"
              >
                Transactions
              </Link>{" "}
              › {id}
            </h2>
            <h1 tw="font-medium text-2xl leading-relaxed my-4 py-2">{title}</h1>
            <Actions />
            <div tw="grid gap-4">
              {instructions?.map((instruction, i) => (
                <InstructionCard
                  key={`ix_${i}`}
                  instruction={instruction}
                  index={i}
                />
              ))}
            </div>
          </div>
          <div tw="pb-4 border-b">
            {txEnv && network !== "localnet" && (
              <div>
                <a
                  tw="text-sm flex items-center gap-2 text-primary"
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
      <div tw="flex-grow[1] border-l px-6">
        <TXSidebar />
      </div>
    </div>
  );
};
