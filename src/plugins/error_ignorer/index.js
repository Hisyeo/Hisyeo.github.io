module.exports = function (context, options) {
    return {
        name: 'error-ignorer',
        configureWebpack(config, isServer) {
            return {
                devServer: {
                    client: {
                        overlay: {
                            runtimeErrors: (error) => {
                                const ignoreErrors = [
                                    "ResizeObserver loop limit exceeded",
                                    "ResizeObserver loop completed with undelivered notifications.",
                                ];
                                return !ignoreErrors.includes(error.message);
                            },
                        },
                    },
                },
            };
        },
    };
};
