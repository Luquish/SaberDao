import React from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "muted" | "error" | "warn";
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "muted" | "error" | "warn";
}

const styles = {
  card: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid',
    fontSize: '14px',
  },
  primary: {
    borderColor: 'var(--primary)',
    background: 'rgba(var(--primary-rgb), 0.2)',
    color: 'var(--primary-100)',
  },
  error: {
    borderColor: 'var(--red-500)',
    background: 'rgba(var(--red-500-rgb), 0.2)',
    color: 'var(--red-100)',
  },
  muted: {
    borderColor: 'var(--slate-500)',
    background: 'rgba(var(--slate-500-rgb), 0.4)',
    color: 'var(--slate-200)',
  },
  warn: {
    borderColor: 'var(--yellow-500)',
    background: 'rgba(var(--yellow-500-rgb), 0.2)',
    color: 'var(--yellow-500)',
  },
};

export const HelperCard: React.FC<Props> = ({
  children,
  variant = "primary",
  className,
}: Props) => {
  return (
    <div
      style={{ ...styles.card, ...styles[variant] }}
      className={className}
    >
      {children}
    </div>
  );
};
