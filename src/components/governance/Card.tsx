import { Link } from "gatsby";
import { CardErrorBoundary } from "./CardErrorBoundary";

const styles = {
  card: {
    borderRadius: '0.25rem',
    backgroundColor: '#1c1917',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardTitle: {
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.75rem',
    width: '100%',
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: '-0.025em',
    borderBottom: '1px solid #292524',
  },
  cardBody: {
    display: 'flex',
  },
  padded: {
    padding: '1rem 1.75rem',
  },
  scrollX: {
    overflowX: 'auto' as const,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.25rem 0',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    borderTop: '1px solid #292524',
  },
  link: {
    color: 'white',
  },
  disabled: {
    color: '#57534e',
    cursor: 'not-allowed' as const,
  }
};

interface Props {
  className?: string;
  title?: React.ReactNode;
  titleStyles?: React.CSSProperties;
  children?: React.ReactNode;
  link?: {
    title: string;
    href?: string;
  };
  /**
   * Whether or not to add padding to the card's body.
   */
  padded?: boolean;
  bodyScrollX?: boolean;
}

export const Card: React.FC<Props> = ({
  className,
  title,
  titleStyles,
  children,
  link,
  padded = false,
  bodyScrollX = false,
}: Props) => {
  return (
    <div style={{ ...styles.card }} className={className}>
      {title && (
        <div style={{ ...styles.cardTitle, ...titleStyles }}>
          {typeof title === "string" ? <h2>{title}</h2> : title}
        </div>
      )}
      <CardErrorBoundary>
        <div
          style={{
            ...styles.cardBody,
            ...(padded && styles.padded),
            ...(bodyScrollX && styles.scrollX)
          }}
        >
          {children}
        </div>
      </CardErrorBoundary>
      {link && (
        link.href ? (
          link.href.startsWith('http') ? (
            <a
              href={link.href}
              style={styles.link}
              onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
              onMouseLeave={e => e.currentTarget.style.color = 'white'}
            >
              <div style={styles.cardFooter}>{link.title}</div>
            </a>
          ) : (
            <Link
              to={link.href}
              style={styles.link}
              onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
              onMouseLeave={e => e.currentTarget.style.color = 'white'}
            >
              <div style={styles.cardFooter}>{link.title}</div>
            </Link>
          )
        ) : (
          <div style={{ ...styles.cardFooter, ...styles.disabled }}>
            {link.title}
          </div>
        )
      )}
    </div>
  );
};
