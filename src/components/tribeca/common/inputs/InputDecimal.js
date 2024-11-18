import React from "react";
import styled from "styled-components";
const DIGIT_ONLY = /^(\d)*$/;
const DECIMAL_ONLY = /^-?\d*(\.\d*)?$/;
export const InputDecimal = ({ onChange, integerOnly, ...rest }) => (React.createElement(StyledInput, { ...rest, onChange: (e) => {
        const { value } = e.target;
        if (integerOnly) {
            if (value === "" ||
                (DIGIT_ONLY.test(value) && !Number.isNaN(parseInt(value)))) {
                onChange?.(value);
            }
            return;
        }
        if ((!Number.isNaN(value) && DECIMAL_ONLY.test(value)) ||
            value === "" ||
            value === "-") {
            onChange?.(value);
        }
    } }));
const StyledInput = styled.input `
  font-family: monospace;
  font-size: 1.5rem;
  outline: none;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;

  &:disabled {
    color: #cbd5e0;
  }

  &::placeholder {
    color: #718096;
  }
`;
