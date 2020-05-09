module.exports = {
    devServer : {
        host: '0.0.0.0',
        port: 9999,
        // proxy:{
        //     "/api": {
        //         target: "http://localhost:8080" , // 跨域访问
        //         changOrigin: true,
        //         secure: false,
        //         pathRewrite: {
        //           '^/api': '',
        //         }
        //     }   
        // }
    },
}