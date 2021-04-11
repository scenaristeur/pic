// module.exports = {
//     devServer: {
//       disableHostCheck: true
//     }
//   }

//const publicPath = process.env.NODE_ENV === 'production' ? '/pic/' : '/'

module.exports = {
    // publicPath: publicPath,
    // browser-vue https://github.com/ipfs/js-ipfs/blob/c47a6335b77d5284711f13a83349000820f85775/examples/browser-vue/vue.config.js
    // chainWebpack: config => config.resolve.symlinks(false),
    // devServer: { https: true },
    // pwa: {
    //     workboxPluginMode: "InjectManifest",
    //     workboxOptions: {
    //         swSrc: 'src/service-worker.js'
    //     }
    // }
    pwa: {
        themeColor: "#42b983",
        msTileColor: "#42b983",
        appleMobileWebAppCache: "yes",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: 'src/service-worker.js'
        },
        manifestOptions: {
            background_color: "#42b983"
        }
    }
}
