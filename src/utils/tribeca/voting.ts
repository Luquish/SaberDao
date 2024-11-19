import { VoteSide } from "@tribecahq/tribeca-sdk";

const sideColor = (side: VoteSide): string =>
  side === VoteSide.For
    ? "var(--color-primary)"
    : side === VoteSide.Against
      ? "var(--color-red-500)"
      : side === VoteSide.Abstain
        ? "var(--color-yellow-500)"
        : "transparent";

export default sideColor;