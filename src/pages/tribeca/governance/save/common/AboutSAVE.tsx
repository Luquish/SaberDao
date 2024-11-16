import { FaArrowRight } from "react-icons/fa";

import { CardWithImage } from "../../../../common/governance/CardWithImage";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
import { ProseSmall } from "../../../../common/typography/Prose";
import { ReactComponent as AboutSAVEImage } from "./AboutSAVEImage.svg";

export const AboutSAVE: React.FC = () => {
  return (
    <CardWithImage
      title="About SAVE Tokens"
      image={
        <div tw="flex items-center justify-center p-8">
          <AboutSAVEImage tw="w-3/4 h-3/4" />
        </div>
      }
    >
      <ProseSmall>
        <p>
          The Simple Agreement for Vote-Escrowed Tokens, i.e. <em>SAVE</em>, is
          a token derivative which enforces that membership tokens must be
          locked for a specific period of time.
        </p>
        <p>
          As SAVEs are not directly convertible to the underlying token, SAVEs
          are a powerful primitive for issuing grants for DAO participants that
          do not restrict transferability of tokens.
        </p>
        <ExternalLink
          href="https://github.com/TribecaHQ/save"
          icon={<FaArrowRight />}
        >
          Learn more
        </ExternalLink>
      </ProseSmall>
    </CardWithImage>
  );
};
