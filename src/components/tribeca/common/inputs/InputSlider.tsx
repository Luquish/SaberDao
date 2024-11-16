import "@reach/slider/styles.css";
import { SliderInput as ReachSlider } from "@reach/slider";
import { styled } from "@emotion/styled";

const InputSlider = styled(ReachSlider)`
  background: none;

  [data-reach-slider-range] {
    background: none;
  }

  [data-reach-slider-track] {
    background: linear-gradient(to right, #1f2937, #e5e7eb);
    border-radius: 0.25rem;
    height: 0.25rem;
  }

  [data-reach-slider-handle] {
    background-color: #1f2937;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    box-shadow: 0px 6px 12px 8px rgba(0, 0, 0, 0.3);
  }
`;

export { InputSlider };