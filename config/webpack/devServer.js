const path = require('path');

module.exports = {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3002,
    disableHostCheck: true,
    proxy: {
        '/service/*': {
            // target: 'http://192.168.0.143:40001/',
            // target: 'http://127.0.0.1:20000/',
            target: 'http://192.168.0.171:10001',
            // target: 'http://localhost:9090/',
            // pathRewrite: {
            //     '^/service': '/'
            // },
            secure: false
        },
        '/upload/*': {
            // target: 'http://192.168.0.148:40001/',
            // target: 'http://192.168.0.148:10003/',
            target: 'http://192.168.0.171:10001',
            // target: 'http://localhost:9090/',
            // pathRewrite: {
            //     '^/upload': '/'
            // },
            secure: false
        },
        '/manage-service/*': {
            // target: 'http://localhost:9090/',
            // pathRewrite: {
            //     '^/manage-service': '/proxy'
            // },
            // target: 'http://192.168.0.143:8085/',
            // pathRewrite: {
            //     '^/manage-service': '/manage'
            // },
            // target: 'http://192.168.0.143:8085/',
            // target: 'http://192.168.0.171:10001',
            target: 'http://192.168.0.143:8085/',
            pathRewrite: {
                '^/manage-service': '/manage/v2.1'
            },
            // target: 'http://192.168.0.143:40000/',
            secure: false
        }
    },
    outputPath: path.resolve(__dirname, './build'),
};