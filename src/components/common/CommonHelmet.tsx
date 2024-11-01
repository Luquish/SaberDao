import { Helmet } from "react-helmet";

import { APP_CONFIG } from "../../config";

interface Props {
  title: string;
  description?: string;
  pageTitle?: string;
}

export const CommonHelmet: React.FC<Props> = ({
  title,
  pageTitle = `${title} | ${APP_CONFIG.name}`,
  description,
}: Props) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Helmet>
      <title>{pageTitle}</title>

      {description && <meta name="description" content={description} />}
      {description && <meta name="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}

      <meta name="og:title" content={title} />
      <meta name="twitter:title" content={title} />
    </Helmet>
  );
};
