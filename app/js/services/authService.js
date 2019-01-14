onegreek.service('authService', function($http, $q, $cordovaFacebook, urlFactory, universityService, organizationService) {
    var authService = {

        user: null,

        /**
         *
         * @returns {string}
         */
        getFacebookAccessToken: function() {
            return (authService.user ? authService.user.facebook_access_token : '');
        },

        /**
         *
         * @returns {boolean}
         */
        isLoggedIn: function() {
            return this.user != null;
        },

        /**
         *
         * @param user
         */
        setUser:function(user) {
            if(user) {
                setUserUuid(user.uuid);
                user.university = user.university ? user.university : user.university = universityService.getUniversity(user.university_id);
                user.organization = user.organization ? user.organization : user.organization = organizationService.getOrganization(user.organization_id);
            }
            this.user = user;
        },

        /**
         *
         * @returns {null}
         */
        getUser: function() {
            return this.user;
        },

        /**
         *
         * @param fbUserId
         * @param fbAccessToken
         * @returns {*}
         */
        loginByFacebook: function(fbUserId, fbAccessToken) {
            return $http.post(urlFactory.apiUrl('facebook/auth'), {
                facebook_access_token: fbAccessToken
            }).then(function(response) {
                var data = response.data;
                authService.setUser(data.user);
                return response;
            });
        },

        /**
         *
         * @returns {*}
         */
        logout:function() {
            onegreekConfig.user_uuid = null;
            this.setUser(null);
            return $cordovaFacebook.logout();
        },

        /**
         *
         * @returns {null|int}
         */
        userIsRegistered:function() {
            return authService.user && (authService.user.university_id || authService.user.brand_id);
        },

        /**
         *
         * @returns {*}
         */
        canUserPostToFacebook: function() {
            var q = $q.defer();
            $cordovaFacebook.login(['publish_actions'])
                .then(function() {
                    q.resolve(true);
                }, function() {
                    q.reject(false);
                });
            return q.promise;
        }

    };
    return authService;
});