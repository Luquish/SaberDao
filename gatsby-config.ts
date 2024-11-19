import type { GatsbyConfig } from 'gatsby';

require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
    siteMetadata: {
        title: 'dapp',
        siteUrl: 'https://www.saber.so',
    },
    graphqlTypegen: true,
    plugins: [
        'gatsby-plugin-postcss',
        {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: "G-R67GCPSJD7",
            },
        },
        'gatsby-plugin-emotion',
        {
            resolve: 'gatsby-plugin-typescript',
            options: {
                isTSX: true,
                allExtensions: true,
            },
        },
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'SaberDAO',
                short_name: 'SaberDAO',
                start_url: '/',
                background_color: '#ffffff',
                theme_color: '#3D42CE',
                display: 'minimal-ui',
                icon: 'src/images/icon.png',
            },
        },
        {
            resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
            options: {
                devMode: false,
                analyzerMode: 'static',
            },
        },
    ],
};

export default config;
