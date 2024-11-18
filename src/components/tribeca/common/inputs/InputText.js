import { styled } from "@emotion/styled";
const commonStyles = `
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  margin: 0;
  transition: colors 0.2s;
  appearance: none;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1a1e2b;
    border-color: #374151;
    color: white;
    
    &:focus {
      background-color: transparent;
    }
  }
`;
export const InputText = styled.input `
  height: 2rem;
  ${commonStyles}
`;
export const Textarea = styled.textarea `
  height: 2rem;
  ${commonStyles}
`;
export const Select = styled.select `
  ${commonStyles}
  
  & > option {
    color: black;
  }
`;
export const Radio = styled.input ``;
