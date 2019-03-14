module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'?'./' :'/',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.0.222:8083/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/djcl_front/api' //代理的路径
                }
            }
        }

    }
}