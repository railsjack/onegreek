onegreek.factory('httpRequestInterceptor', function() {
    return {
        request: function (config) {
            config.headers['X-OneGreek-User-UUID'] = getUserUuid();
            return config;
        }
    };
});