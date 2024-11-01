import React from "react";

import { NotifiLogo } from "./NotifiLogo";

interface Props {
  body: React.ReactChild;
  switchGroup?: React.ReactChild;
}

export const SubscriptionCard: React.FC<Props> = ({
  body,
  switchGroup,
}: Props) => {
  return (
    <div tw="w-screen max-w-[312px]">
      <div tw="w-full bg-white rounded-lg border dark:(bg-warmGray-850 border-warmGray-800)">
        <div tw="flex flex-col items-stretch gap-2 py-2 px-4 border-b dark:border-warmGray-800">
          <h2 tw="text-white font-bold mb-2">Get Notifications</h2>
          {body}
        </div>
        {switchGroup}
        <div tw="flex items-center justify-start py-2 px-4 dark:border-warmGray-800">
          <span tw="text-xs">Powered by</span>
          <NotifiLogo tw="h-4 w-16 ml-1 pb-1" />
          <span tw="flex-grow"></span>
          <span tw="text-xs ml-1 hover:text-primary">
            <a
              href="https://notifi.network/faqs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
