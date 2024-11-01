import type { GatsbyConfig } from 'gatsby';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
    siteMetadata: {
        title: 'Unified Dapp',
        siteUrl: 'https://www.example.com',
    },
    plugins: [
        'gatsby-plugin-postcss',
        {
            resolve: '@sentry/gatsby',
            options: {
                dsn: process.env.REACT_APP_SENTRY_DSN || '',
                environment: process.env.NODE_ENV || 'development',
            }
        },
        {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
                trackingId: process.env.REACT_APP_GA_ID || '',
            }
        },
        {
            resolve: 'gatsby-plugin-root-import',
            options: {
                '@': path.join(__dirname, 'src'),
                '@/src': path.join(__dirname, 'src'),
                'components': path.join(__dirname, 'src/components'),
                'hooks': path.join(__dirname, 'src/hooks'),
                'utils': path.join(__dirname, 'src/utils'),
                'helpers': path.join(__dirname, 'src/helpers')
            }
        }
    ],
};

export default config; 