import { pickBy } from "lodash-es";
import { FaDiscord, FaGithub, FaMedium, FaTwitter } from "react-icons/fa";
import tw, { css } from "twin.macro";

import { useGovernor } from "../../../hooks/tribeca/useGovernor";
import { Button } from "../Button";
import { PageContainer } from "./GovernancePageInner";

const SOCIALS = {
  discord: <FaDiscord />,
  github: <FaGithub />,
  medium: <FaMedium />,
  twitter: <FaTwitter />,
};

export const Footer: React.FC = () => {
  const { manifest } = useGovernor();
  if (!manifest) {
    return null;
  }

  const otherLinks = pickBy(manifest.links ?? {}, (_v, k) => {
    return !(k in SOCIALS) && k !== "app";
  });

  return (
    <footer tw="w-full bg-warmGray-900 pt-5">
      <PageContainer tw="w-11/12">
        <div tw="flex flex-col gap-8 md:flex-row justify-between py-8">
          <div tw="md:block">
            <a
              href={manifest.links?.website?.url ?? "#"}
              target="_blank"
              rel="noreferrer"
            >
              <div tw="w-9 h-9">
                <img
                  src={manifest.governance.iconURL}
                  alt={`Icon of ${manifest.governance.name}`}
                />
              </div>
            </a>
          </div>
          <div tw="flex gap-24">
            {Object.entries(otherLinks).length > 0 && (
              <div>
                <h2 tw="text-white font-semibold mb-4">
                  {manifest.governance.name}
                </h2>
                <div tw="flex flex-col gap-3 text-warmGray-600 text-sm">
                  {Object.entries(otherLinks).map(([name, link]) => {
                    return (
                      <a
                        key={name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <h2 tw="text-white font-semibold mb-4">Tribeca</h2>
              <div tw="flex flex-col gap-3 text-warmGray-600 text-sm">
                {Object.entries({
                  Documentation: "https://docs.tribeca.so",
                  GitHub: "https://github.com/TribecaHQ",
                }).map(([name, link]) => {
                  return (
                    <a key={name} href={link} target="_blank" rel="noreferrer">
                      {name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div tw="flex md:justify-end">
            <div>
              {manifest?.links?.app && (
                <a
                  href={manifest.links.app.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="md" variant="outline">
                    {manifest.links.app.label}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
        <div tw="flex justify-between items-center py-8 mt-8 border-t border-t-warmGray-850 text-xs">
          <p tw="text-warmGray-700">Built by the Tribeca DAO</p>
          <div tw="flex gap-4">
            {Object.entries(SOCIALS).map(([id, icon]) => {
              const link = manifest.links?.[id];
              if (!link) {
                return null;
              }
              return (
                <a
                  key={id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  tw="hover:text-primary transition-colors"
                  css={css`
                    svg {
                      ${tw`w-4 h-4`}
                    }
                  `}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </footer>
  );
};
