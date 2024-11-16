import type { ReactNode } from "react";
import { useState } from "react";
import { FiCheckCircle, FiCopy, FiXCircle } from "react-icons/fi";
import React from "react";

type CopyState = "copy" | "copied" | "errored";

export const Copyable = ({
  text,
  children,
  replaceText,
}: {
  text: string;
  children: ReactNode;
  replaceText?: boolean;
}) => {
  const [state, setState] = useState<CopyState>("copy");

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch (err) {
      setState("errored");
    }
    setTimeout(() => setState("copy"), 1000);
  };

  function CopyIcon() {
    if (state === "copy") {
      return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <button className="cursor-pointer" onClick={handleClick}>
          <FiCopy />
        </button>
      );
    } else if (state === "copied") {
      return (
        <span>
          <FiCheckCircle />
        </span>
      );
    } else if (state === "errored") {
      return (
        <span title="Please check your browser's copy permissions.">
          <FiXCircle />
        </span>
      );
    }
    return null;
  }

  let message: string | undefined;
  if (state === "copied") {
    message = "Copied";
  } else if (state === "errored") {
    message = "Copy Failed";
  }

  function PrependCopyIcon() {
    return (
      <>
        <span className="text-xs m-2">
          <span className="flex items-center gap-1">
            {message !== undefined && <span>{message}</span>}
            <CopyIcon />
          </span>
        </span>
        {children}
      </>
    );
  }

  function ReplaceWithMessage() {
    return (
      <span className="flex flex-col flex-nowrap">
        <span className="text-xs">
          <span className="flex items-center text-primary">
            <CopyIcon />
            <span className="mx-2">{message}</span>
          </span>
        </span>
        <span className="hidden">{children}</span>
      </span>
    );
  }

  if (state === "copy") {
    return <PrependCopyIcon />;
  } else if (replaceText) {
    return <ReplaceWithMessage />;
  }

  return (
    <>
      <span className="hidden lg:inline">
        <PrependCopyIcon />
      </span>
      <span className="inline lg:hidden">
        <ReplaceWithMessage />
      </span>
    </>
  );
};
