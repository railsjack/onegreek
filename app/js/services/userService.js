onegreek.service('userService', function($http, urlFactory) {
    return {
        /**
         *
         * @param user
         * @returns {HttpPromise}
         */
        register: function(user) {
            var url = urlFactory.apiUrl('user/register');
            return $http.post(url, user);
        },

        /**
         *
         * @param user
         * @returns {HttpPromise}
         */
        save:function(user) {
            var url = urlFactory.apiUrl('user/save');
            return $http.post(url, user);
        }
    };
});