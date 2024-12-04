import tw from "twin.macro";
import styled from "@emotion/styled";
import React from "react";

const ALLIANCE = [
  ["arrow", "arrowprotocol.com"],
  ["asol", "asol.so"],
  ["atrix", "atrix.finance"],
  ["cashio", "cashio.app"],
  ["clb", "clb.exchange"],
  ["crate", "crate.so"],
  ["deltaone", "deltaone.xyz"],
  ["friktion", "friktion.fi"],
  ["goki", "goki.so"],
  ["marinade", "marinade.finance"],
  ["pole", "pole.finance"],
  ["port", "port.finance"],
  ["quarry", "quarry.so"],
  ["saber", "saber.so"],
  ["sencha", "sencha.so"],
  ["serum", "projectserum.com"],
  ["shipcapital", "ship.capital"],
  ["sunny", "sunny.ag"],
  ["traction", "traction.market"],
] as const;

export const Alliance: React.FC = () => {
  return (
    <div tw="mx-auto w-11/12 max-w-5xl">
      <div tw="text-center">
        <h2 tw="text-white text-3xl md:text-5xl font-semibold mb-6">
          The Tribeca DAO
        </h2>
        <div tw="max-w-md mx-auto">
          <p tw="text-gray-400 text-lg md:text-2xl">
            Tribeca is an open source governance primitive built and maintained
            by members of Solana's leading protocols.
          </p>
        </div>
      </div>
      <div tw="grid grid-cols-2 md:(flex flex-wrap items-center justify-center) gap-2.5 my-16">
        {ALLIANCE.map(([name, href]) => (
          <Box
            key={name}
            href={`https://${href}`}
            target="_blank"
            rel="noreferrer"
            tw="bg-gradient-to-b from-gray-900 to-gray-50 hover:(from-gray-800 to-gray-900)"
          >
            <img
              tw="h-14"
              src={`/images/tribeca/alliance/${name}.svg`}
              alt={`Logo for ${name}`}
            />
          </Box>
        ))}
        <Box
          href="https://forms.gle/i1b8WNZvFEP637v96"
          target="_blank"
          tw="border-dashed bg-gray-800 bg-opacity-5 hover:(border-gray-500 bg-gray-500 bg-opacity-10) transition-all"
        >
          <span tw="text-gray-500">You?</span>
        </Box>
      </div>
    </div>
  );
};

const Box = styled.a`
  ${tw`flex items-center justify-center py-6 md:(h-44 w-44 py-0) px-6 border border-gray-800 rounded`}
`;
