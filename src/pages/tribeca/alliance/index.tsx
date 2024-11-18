import React from 'react';

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
    <div className="mx-auto w-11/12 max-w-5xl">
      <div className="text-center">
        <h2 className="text-white text-3xl md:text-5xl font-semibold mb-6">
          The Tribeca DAO
        </h2>
        <div className="max-w-md mx-auto">
          <p className="text-warmGray-400 text-lg md:text-2xl">
            Tribeca is an open source governance primitive built and maintained
            by members of Solana's leading protocols.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-center gap-2.5 my-16">
        {ALLIANCE.map(([name, href]) => (
          <Box
            key={name}
            href={`https://${href}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "linear-gradient(rgb(11, 11, 14) 0%, rgb(5, 5, 7) 100%)",
            }}
            className="flex items-center justify-center py-6 md:h-44 md:w-44 md:py-0 px-6 border border-coolGray-800 rounded hover:bg-gradient-to-b hover:from-[rgb(22,22,27)] hover:to-[rgb(26,26,35)]"
          >
            <img
              className="h-14"
              src={`/images/tribeca/alliance/${name}.svg`}
              alt={`Logo for ${name}`}
            />
          </Box>
        ))}
        <Box
          href="https://forms.gle/i1b8WNZvFEP637v96"
          target="_blank"
          className="flex items-center justify-center py-6 md:h-44 md:w-44 md:py-0 px-6 border border-dashed border-coolGray-800 rounded bg-gray-800 bg-opacity-5 hover:border-primary hover:bg-primary hover:bg-opacity-10 transition-all"
        >
          <span className="text-primary">You?</span>
        </Box>
      </div>
    </div>
  );
};

interface BoxProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({ children, className, ...props }) => (
  <a className={className} {...props}>
    {children}
  </a>
);
