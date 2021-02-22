module.exports = {
    devServer: {
        port: 8884,
        open: true,
        // proxy: {
        //     '/devApi': {
        //         //target: 'http://47.115.115.79:8886/api',//新云服务器的地址
        //         target: 'http://192.168.0.144:8886/api', //本地服务器的地址
        //         // target: 'https://localhost:44379/api', //VS调试地址
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/devApi': ''
        //         },
        //     }
        // },
        //// 此处开启 https
        // https: true,
    }
}
