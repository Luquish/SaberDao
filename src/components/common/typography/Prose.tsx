import tw, { styled } from "twin.macro";

export const Prose = styled.div`
  ${tw`text-sm sm:text-base leading-relaxed`}
  p {
    ${tw`mb-4`}
    &:last-child {
      ${tw`mb-0`}
    }
  }
  a {
    ${tw`text-primary hover:underline`}
  }
  code {
    ${tw`hyphens[auto]`}
  }
  ol {
    ${tw`list-decimal pl-4`}
  }
  ul {
    ${tw`list-disc pl-4`}
  }
  h1,
  h2,
  h3 {
    ${tw`text-white font-semibold`}
  }
  h1 {
    ${tw`text-xl`}
  }
  h2 {
    ${tw`text-lg`}
  }
  h3 {
    ${tw`text-base sm:text-lg`}
  }
`;

export const ProseSmall = styled(Prose)`
  ${tw`text-sm sm:text-sm`}
`;
