const webpack = require('webpack');
const path = require('path');

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
    const config = getConfig();
    
    actions.setWebpackConfig({
        resolve: {
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert/'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                os: require.resolve('os-browserify/browser'),
                url: require.resolve('url/'),
                buffer: require.resolve('buffer/'),
            },
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
            }),
        ],
    });
}; 