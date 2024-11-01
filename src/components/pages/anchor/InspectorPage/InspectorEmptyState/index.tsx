import { extractErrorMessage } from "@rockooor/sail";
import { Message } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import tw, { css } from "twin.macro";

import { Card } from "../../../../common/governance/Card";
import { MIN_MESSAGE_LENGTH } from "..";

export const InspectorEmptyState: React.FC = () => {
  const [rawTXStr, setRawTXStr] = useState<string>("");

  const { message } = useMemo(() => {
    const raw = Buffer.from(rawTXStr, "base64");
    try {
      if (raw.length < MIN_MESSAGE_LENGTH) {
        throw new Error(
          `message is too short (must be ${MIN_MESSAGE_LENGTH} bytes, got ${raw.length}})`
        );
      }
      return { message: Message.from(raw) };
    } catch (e) {
      return {
        error: extractErrorMessage(e),
      };
    }
  }, [rawTXStr]);

  const navigate = useNavigate();
  useEffect(() => {
    if (message) {
      navigate(
        `${window.location.pathname}?message=${encodeURIComponent(rawTXStr)}`
      );
    }
  }, [message, navigate, rawTXStr]);

  return (
    <Card title="Encoded Transaction Message">
      <textarea
        tw="w-full bg-transparent border-none focus:(ring-0 outline-none) font-mono px-7 py-4 text-sm resize-none"
        onChange={(e) => setRawTXStr(e.target.value)}
        placeholder="Paste raw base64 encoded transaction message"
      />
      <div tw="text-sm px-7 py-4 border-t border-t-warmGray-800 text-white">
        <h2 tw="font-semibold text-base mb-2">Instructions</h2>
        <ul
          tw="list-disc ml-4 leading-loose"
          css={css`
            code {
              ${tw`bg-warmGray-900 rounded p-1`}
            }
          `}
        >
          <li>
            CLI: Use <code>--dump-transaction-message</code> flag
          </li>
          <li>
            Rust: Add base64 crate dependency and{" "}
            <code>
              println!("", base64::encode(&transaction.message_data()));
            </code>
          </li>
          <li>
            JavaScript: Add{" "}
            <code>console.log(tx.serializeMessage().toString("base64"));</code>
          </li>
        </ul>
      </div>
    </Card>
  );
};
