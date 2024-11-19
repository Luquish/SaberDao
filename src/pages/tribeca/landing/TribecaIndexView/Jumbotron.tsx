import { css, keyframes } from "@emotion/react";
import { FaArrowRight } from "react-icons/fa";
import React from "react";

import { Button } from "@/components/tribeca/common/Button";

const FADE_IN_DOWN = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Jumbotron: React.FC = () => {
  return (
    <header className="w-full flex flex-col gap-6 pt-16 relative">
      <div className="w-11/12 md:(w-full max-w-4xl) flex flex-col gap-6 mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold leading-snug text-white relative md:(text-7xl leading-snug)">
            <div
              css={css`
                animation: 1.5s ${FADE_IN_DOWN} 0.01s normal forwards ease-out;
              `}
            >
              Governance.
            </div>
            <div
              css={css`
                opacity: 0;
                animation: 1.5s ${FADE_IN_DOWN} 0.2s normal forwards ease-out;
              `}
            >
              By DAOs, for DAOs.
            </div>
          </h1>
        </div>
        <p
          className="text-gray-200 text-base leading-relaxed max-w-3xl md:(text-2xl leading-relaxed)"
          css={css`
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.4s normal forwards ease-out;
          `}
        >
          Tribeca is a protocol for creating, managing, and interacting with
          decentralized autonomous organizations on Solana.
        </p>
        <div
          className="mt-6 flex flex-col gap-4 md:flex-row"
          css={css`
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.6s normal forwards ease-out;
          `}
        >
          <a
            target="_blank"
            href="https://github.com/TribecaHQ/tribeca"
            rel="noreferrer"
          >
            <Button
              variant="primary"
              className="flex font-semibold items-center gap-4 h-12 w-[200px] text-base hover:(border-none bg-white text-black)"
            >
              <span>View the Code</span>
              <FaArrowRight />
            </Button>
          </a>
          <a target="_blank" href="https://docs.tribeca.so" rel="noreferrer">
            <Button
              variant="outline"
              className="flex font-semibold items-center gap-4 h-12 w-[200px] text-base hover:(border-none bg-white text-black)"
            >
              <span>Read the Docs</span>
              <FaArrowRight />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Jumbotron;
