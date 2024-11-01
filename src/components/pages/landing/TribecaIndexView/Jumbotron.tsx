import { css, keyframes } from "@emotion/react";
import { FaArrowRight } from "react-icons/fa";

import { Button } from "../../../common/Button";

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

export const Jumbotron: React.FC = () => {
  return (
    <header tw="w-full flex flex-col gap-6 pt-16 relative">
      <div tw="w-11/12 md:(w-full max-w-4xl) flex flex-col gap-6 mx-auto">
        <div tw="flex flex-col gap-2">
          <h1 tw="text-3xl font-bold leading-snug text-white relative md:(text-7xl leading-snug)">
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
          tw="text-gray-200 text-base leading-relaxed max-w-3xl md:(text-2xl leading-relaxed)"
          css={css`
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.4s normal forwards ease-out;
          `}
        >
          Tribeca is a protocol for creating, managing, and interacting with
          decentralized autonomous organizations on Solana.
        </p>
        <div
          tw="mt-6 flex flex-col gap-4 md:flex-row"
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
              tw="flex font-semibold items-center gap-4 h-12 w-[200px] text-base hover:(border-none bg-white text-black)"
            >
              <span>View the Code</span>
              <FaArrowRight />
            </Button>
          </a>
          <a target="_blank" href="https://docs.tribeca.so" rel="noreferrer">
            <Button
              variant="outline"
              tw="flex font-semibold items-center gap-4 h-12 w-[200px] text-base hover:(border-none bg-white text-black)"
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
