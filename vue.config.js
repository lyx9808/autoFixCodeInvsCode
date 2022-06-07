module.exports = {
    transpileDependencies: true,
    devServer: {
        historyApiFallback: true,
        allowedHosts: "all",
        proxy: {
            "/api": {
                target: "http://172.18.14.93/api",
                changeOrigin: true,
                pathRewrite: { "^/api": "" },
            },
        },
    },
};
