import React from "react";
import tw from "twin.macro";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/governance/Button";

export const Jumbotron: React.FC = () => {
  return (
    <header tw="w-full flex flex-col gap-6 pt-16 relative">
      <div tw="w-11/12 md:(w-full max-w-4xl) flex flex-col gap-6 mx-auto">
        <div tw="flex flex-col gap-2">
          <h1 tw="text-3xl font-bold leading-snug text-white relative md:(text-7xl leading-snug)">
            <div tw="animate-fade-in-down">
              Governance.
            </div>
            <div tw="opacity-0 animate-fade-in-down-delayed">
              By DAOs, for DAOs.
            </div>
          </h1>
        </div>
        <p tw="text-gray-200 text-base leading-relaxed max-w-3xl md:(text-2xl leading-relaxed) opacity-0 animate-fade-in-down-delayed-2">
          Tribeca is a protocol for creating, managing, and interacting with
          decentralized autonomous organizations on Solana.
        </p>
        <div tw="mt-6 flex flex-col gap-4 md:flex-row opacity-0 animate-fade-in-down-delayed-3">
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
