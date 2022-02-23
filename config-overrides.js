const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    const plugins = [new CopyWebpackPlugin({
        patterns: [
            { from: 'node_modules/@shoelace-style/shoelace/dist', to: 'shoelace' }
        ]
    })]

    config.plugins = Array.isArray(config.plugins) ? [...config.plugins, ...plugins] : plugins

    return config
}