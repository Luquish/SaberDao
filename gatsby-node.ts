import path from 'path';
import webpack from 'webpack';
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
  });
};

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const { createPage } = actions

  createPage({
    path: "/wallets/:walletKey/*",
    component: path.resolve("./src/pages/tribeca/wallet/WalletView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/:governor/*",
    component: path.resolve("./src/pages/tribeca/GovernanceManageView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/:governor/proposals/:proposalIndex",
    component: path.resolve("./src/pages/tribeca/proposals/ProposalIndexView/nft-voter/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/:governor/gauges/:stakedMint",
    component: path.resolve("./src/pages/tribeca/gauges/GaugeIndexView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/:governor/saves/:saveMint",
    component: path.resolve("./src/pages/tribeca/save/SAVEIndexView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/saber-pools",
    component: path.resolve("./src/pages/tribeca/saber-pools/SaberPoolsView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/saber-pools/:poolID/fees",
    component: path.resolve("./src/pages/tribeca/saber-pools/SaberPoolView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/address/:voter/snapshots",
    component: path.resolve("./src/pages/tribeca/voters/VoterSnapshotsView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/address/:voter",
    component: path.resolve("./src/pages/tribeca/voters/VoterIndexView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/leaderboard",
    component: path.resolve("./src/pages/tribeca/voters/AllVotersView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/nftgauges/validator",
    component: path.resolve("./src/pages/tribeca/nft-gauges/Index.tsx"),
    context: { label: "Validator" },
  })

  createPage({
    path: "/tribeca/gov/nftgauges/liquidity",
    component: path.resolve("./src/pages/tribeca/nft-gauges/Index.tsx"),
    context: { label: "Liquidity" },
  })

  createPage({
    path: "/tribeca/gov/locker/:lockerSubpage",
    component: path.resolve("./src/pages/tribeca/locker/LockerIndexView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/details",
    component: path.resolve("./src/pages/tribeca/GovernanceDetailsView/index.tsx"),
    context: {},
  })

  createPage({
    path: "/tribeca/gov/setup",
    component: path.resolve("./src/pages/tribeca/GovernanceSetupView/index.tsx"),
    context: {},
  })
} 