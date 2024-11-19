import React from 'react';

export interface BoxProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({ children, className, ...props }) => (
  <a className={className} {...props}>
    {children}
  </a>
);

export default Box; 