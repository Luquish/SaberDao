import path from 'path';
import webpack, { runtime } from 'webpack';
import { GatsbyNode } from 'gatsby';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions, getConfig }) => {
  const config = getConfig();
  
  // Handle externals if they exist
  if (config.externals && config.externals[0]) {
    config.externals[0]['node:crypto'] = 'crypto-browserify';
  }

  actions.replaceWebpackConfig(config);
  
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react-query': '@tanstack/react-query',
      },
      fallback: {
        crypto: false,
        url: false,
        zlib: false,
        https: false,
        http: false,
        stream: false,
        assert: false,
        buffer: false,
        fs: false,
        path: false,
        os: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                typescript: true,
                ext: 'tsx'
              }
            }
          ]
        }
      ],
    },
    optimization: {
        runtimeChunk: {
          name: runtime,
        },
        splitChunks: {
          name: false,
          cacheGroups: {
            shared: {
              name: 'shared',
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
    } 
  });
};

export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions }) => {
    const { createPage } = actions

    if (page.path.match(/^\/app/) || page.path.match(/^\/dashboard/)) {
        page.matchPath = `${page.path}/*`
        createPage(page)
    }
}