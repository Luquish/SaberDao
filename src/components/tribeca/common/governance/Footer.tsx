import { pickBy } from "lodash-es";
import { FaDiscord, FaGithub, FaMedium, FaTwitter } from "react-icons/fa";
import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Button } from "../Button";
import { PageContainer } from "./GovernancePageInner";

const SOCIALS = {
  discord: <FaDiscord />,
  github: <FaGithub />,
  medium: <FaMedium />,
  twitter: <FaTwitter />,
};

interface Link {
    url: string;
    label: string;
  }

export const Footer: React.FC = () => {
  const { manifest } = useGovernor();
  if (!manifest) {
    return null;
  }

  const otherLinks = pickBy(manifest.links ?? {}, (_v: Link, k: string) => {
    return !(k in SOCIALS) && k !== "app";
  }) as Record<string, Link>;

  return (
    <footer className="w-full bg-warmGray-900 pt-5">
      <PageContainer className="w-11/12">
        <div className="flex flex-col gap-8 md:flex-row justify-between py-8">
          <div className="md:block">
            <a
              href={manifest.links?.website?.url ?? "#"}
              target="_blank"
              rel="noreferrer"
            >
              <div className="w-9 h-9">
                <img
                  src={manifest.governance.iconURL}
                  alt={`Icon of ${manifest.governance.name}`}
                />
              </div>
            </a>
          </div>
          <div className="flex gap-24">
            {Object.entries(otherLinks).length > 0 && (
              <div>
                <h2 className="text-white font-semibold mb-4">
                  {manifest.governance.name}
                </h2>
                <div className="flex flex-col gap-3 text-warmGray-600 text-sm">
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
              <h2 className="text-white font-semibold mb-4">Tribeca</h2>
              <div className="flex flex-col gap-3 text-warmGray-600 text-sm">
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
          <div className="flex md:justify-end">
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
        <div className="flex justify-between items-center py-8 mt-8 border-t border-t-warmGray-850 text-xs">
          <p className="text-warmGray-700">Built by the Tribeca DAO</p>
          <div className="flex gap-4">
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
                  className="hover:text-primary transition-colors [&>svg]:w-4 [&>svg]:h-4"
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
