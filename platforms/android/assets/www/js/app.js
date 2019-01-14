var onegreek = angular.module('onegreek', [
    'ui.router',
    'ionic',
    'ngCordova'
]);
onegreek.run(["$ionicPlatform", "$http", "$cordovaStatusbar", "authService", function($ionicPlatform, $http, $cordovaStatusbar, authService) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 100);
        $cordovaStatusbar.style(3);
    });

}]);

var reloadOneGree = function() {
    window.location = 'index.html';
};

var getUserUuid = function() {
    return onegreekConfig.user_uuid;
}
var setUserUuid = function(uuid) {
    onegreekConfig.user_uuid = uuid;
}
onegreek.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('httpRequestInterceptor');

    $urlRouterProvider.otherwise('/boot');

    $stateProvider
        .state('boot', {
            url: '/boot',
            templateUrl: 'views/pages/boot.html',
            controller: 'bootController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/pages/login.html',
            controller: 'loginController'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'views/pages/register.html'
        })
        .state('register.university', {
            url: '/register/university',
            templateUrl: 'views/pages/register/university.html',
            controller: 'registerController'
        })
        .state('register.organization', {
            url: '/register/organization',
            templateUrl: 'views/pages/register/organization.html',
            controller: 'registerController'
        })
        .state('register.email', {
            url: '/register/email',
            templateUrl: 'views/pages/register/email.html',
            controller: 'registerController'
        })
        .state('app', {
            url: '/app',
            templateUrl: 'views/pages/app.html'
        })
        .state('app.newsfeed', {
            url: '/newsfeed',
            templateUrl: 'views/pages/app/newsfeed.html'
        })
        .state('app.newsfeed.trending', {
            url: '/trending',
            templateUrl: 'views/pages/app/newsfeed/trending.html',
            controller: 'newsfeedController'
        })
        .state('app.newsfeed.recent', {
            url: '/recent',
            templateUrl: 'views/pages/app/newsfeed/recent.html',
            controller: 'newsfeedController'
        })
        .state('app.newsfeed.compose', {
            url: '/new',
            templateUrl: 'views/pages/app/newsfeed/new.html',
            controller: 'newsfeedController'
        })
        .state('app.chapters', {
            url: '/chapters',
            templateUrl: 'views/pages/app/chapters.html'
        })
        .state('app.chapters.list', {
            url: '/list',
            templateUrl: 'views/pages/app/chapters/list.html',
            controller: 'chapterListController'
        })
        .state('app.chapters.roster', {
            url: '/roster/:chapterId',
            templateUrl: 'views/pages/app/chapters/roster.html',
            controller: 'chapterRosterController'
        })
        .state('app.settings', {
            url: '/settings',
            templateUrl: 'views/pages/app/settings.html',
            controller: 'settingsController'
        });
}]);

onegreek.controller('bootController', ["$state", "$http", "$cordovaFacebook", "urlFactory", "authService", "universityService", "organizationService", function($state, $http, $cordovaFacebook, urlFactory, authService, universityService, organizationService) {

    var boot = function() {
        $http.get(urlFactory.bootUrl())
            .then(function(response) {
                var data = response.data;
                authService.setUser(data.user);
                universityService.setUniversities(data.universities);
                organizationService.setOrganizations(data.organizations);
                attemptLogin();
            });
    };

    var attemptLogin = function() {
        $cordovaFacebook.getLoginStatus()
            .then(function(success) {
                if(success.status == 'unknown') {
                    $state.go('login');
                } else {
                    var authResponse = success.authResponse;
                    authService.loginByFacebook(authResponse.userID, authResponse.accessToken)
                        .then(function(response) {
                            if(authService.user && authService.user.university_id) {
                                $state.go('app.newsfeed.recent');
                            } else {
                                $state.go('register.university');
                            }
                        });
                }
            });
    };

    boot();

}]);
onegreek.controller('chapterListController', ["$scope", "$state", "authService", "chapterService", "$state", function($scope, $state, authService, chapterService, $state) {

    if(!authService.isLoggedIn()) {
        $state.go('boot');
    }

    $scope.chapters = null;

    chapterService.getChapters(authService.getUser().university_id)
        .then(function(response) {
            $scope.chapters = response.data;
        });

}]);
onegreek.controller('chapterRosterController', ["$scope", "$state", function($scope, $state) {

}]);
onegreek.controller('loginController', ["$scope", "$state", "$cordovaFacebook", "authService", function($scope, $state, $cordovaFacebook, authService) {

    $scope.isWorking = false;
    $scope.error = null;

    $scope.initiateLogin = function() {
        $scope.isWorking = true;
        $cordovaFacebook.getLoginStatus()
            .then(function(success) {
                if(success.status == 'unknown') {
                    $scope.doFacebookLogin();
                } else {
                    var authResponse = success.authResponse;
                    $scope.login(authResponse.userID, authResponse.accessToken);
                }
            }, function (error) {
                $scope.isWorking = false;
                $scope.error = 'An error occurred.';
            });

    };

    $scope.login = function(fbUserId, fbAccessToken) {
        authService.loginByFacebook(fbUserId, fbAccessToken)
            .then(function(response) {
                if(authService.user && authService.user.university_id) {
                    $scope.isWorking = false;
                    $state.go('app');
                } else {
                    $scope.isWorking = false;
                    $state.go('register.university');
                }
            });
    };

    $scope.doFacebookLogin = function() {
        $cordovaFacebook.login(['public_profile', 'email'])
            .then(function(success) {
                var authResponse = success.authResponse;
                $scope.login(authResponse.userID, authResponse.accessToken);
            }, function(error) {
                $scope.isWorking = false;
                $scope.error = 'An error occurred.';
            });
    };

}]);
onegreek.controller('newsfeedController', ["$scope", "$state", "$ionicActionSheet", "authService", "newsfeedService", "deviceMediaService", function($scope, $state, $ionicActionSheet, authService, newsfeedService, deviceMediaService) {

    $scope.posts = null;
    $scope.draftPost = null;
    $scope.currentUser = authService.getUser();

    if($state.$current.name == 'app.newsfeed.recent') {
        newsfeedService.getRecent().then(function(response) {
            $scope.posts = response.data;
        });
    } else if($state.$current.name == 'app.newsfeed.trending') {
        newsfeedService.getTrending().then(function(response) {
            $scope.posts = response.data;
        });
    }

    $scope.takePhoto = function() {
        deviceMediaService.takePicture().then(function (result) {

        });
    };

    $scope.choosePhoto = function() {
        deviceMediaService.choosePicture().then(function (result) {

        });
    };

    $scope.submitPost = function() {

    };
}]);
onegreek.controller('registerController', ["$scope", "$state", "authService", "userService", "universityService", "organizationService", function($scope, $state, authService, userService, universityService, organizationService) {

    if( !authService.isLoggedIn() ) {
        $state.go('boot');
    };

    // Scope values
    $scope.isLoading = false;
    $scope.isSubmitted = false;
    $scope.user = authService.user;
    $scope.universities = universityService.universities;
    $scope.organizations = universityService.organizations;
    $scope.filters = {
        university_name: '',
        organization_name: ''
    };

    $scope.filterList = function(list, search) {
        var filtered = [];
        if(search) {
            for(key in list) {
                if(list[key].name && list[key].name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    filtered.push(list[key]);
                }
            }
        } else {
            filtered = list;
        }
        return filtered;
    };
    $scope.updateUniversities = function() {
        $scope.universities = $scope.filterList(universityService.universities, $scope.filters.university_name);
    };
    $scope.selectUniversity = function(university) {
        authService.user.university_id = university.id;
        $state.go('register.organization');
    };
    $scope.updateOrganizations = function() {
        $scope.organizations = $scope.filterList(organizationService.organizations, $scope.filters.organization_name);
    };
    $scope.selectOrganization = function(organization) {
        authService.user.organization_id = organization.id;
        $state.go('register.email');
    };
    $scope.submitRegistration = function() {

        var endsWith = function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var validateEmail = function(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2,66})?)$/i;
            var valid = re.test(email);
            if(valid) {
                return endsWith(email, '.edu');
            } else {
                return false;
            }
        }

        if(validateEmail(authService.user.university_email)) {
            $scope.isLoading = true;
            userService.register(authService.user)
                .then(function(response) {
                    $scope.isLoading = false;
                    $scope.isSubmitted = true;
                    authService.setUser(response.data.user);
                });
        } else {
            alert('Please enter a valid .edu email.');
        }

    };

    $scope.updateUniversities();
    $scope.updateOrganizations();
}]);
onegreek.controller('settingsController', ["$scope", "$state", "authService", function($scope, $state, authService) {

    $scope.logout = function() {
        authService.logout();
        $state.go('boot');
    }

}]);
onegreek.directive('ogFocusOnLoad', function() {
    return function(scope, elm, attr) {
       //$(elm).focus();
    };

});
onegreek.directive('ogNewsfeedPost', function() {
    return {
        scope: {
            post: '='
        },
        controller: ["$scope", "authService", function($scope, authService) {
            $scope.showComments = false;
            $scope.currentUser = authService.user;

            $scope.upvote = function() {
                $scope.post.my_vote = true;
            };
            $scope.downvote = function() {
                $scope.post.my_vote = true;
            }
            $scope.toggleComments = function() {
                $scope.showComments = !$scope.showComments;
            };
        }],
        templateUrl: 'views/partials/og-newsfeed-post.html'
    }
});
onegreek.directive('valignElement', ["$window", function($window){
    // vertical center element on page
    return function(scope, element){
        var pixels;
        var w = angular.element($window);
        function setPixels(){
            var h = $window.innerHeight;
            var eh = element[0].clientHeight*1.1;
            pixels = (h - eh)/2 - 30;
            if (pixels < 50) {
                pixels = 50 + 'px';
            } else {
                pixels = pixels + 'px';
            }
            element.css('margin-top', pixels);
        }
        setPixels();
        w.bind('resize', function(){
            setPixels();
        });
    }
}]);
onegreek.factory('httpRequestInterceptor', function() {
    return {
        request: function (config) {
            config.headers['X-OneGreek-User-UUID'] = getUserUuid();
            return config;
        }
    };
});
onegreek.factory('urlFactory', function() {
   return {
       apiUrl: function(partial) {
           return onegreekConfig.onegreekApiEndpoint + partial
       },
       bootUrl: function() {
           return onegreekConfig.onegreekApiEndpoint.replace('api/', 'boot.json');
       }
   }
});
onegreek.filter('chapterTypeFromGender', function() {
    return function(input) {
        return input == 'male' ? 'Fraterntiy' : 'Sorority';
    };
});
onegreek.filter('hashtagParser', ["$sce", function($sce) {
    return function(input) {
        input = input ? input : '';
        var split = input.split(' ');
        var newString = '';
        for(var i in split) {
            if(split[i].substr(0, 1) == '#') {
                split[i] = '<span class="hashtag">'+split[i]+'</span>';
            }
        }
        return $sce.trustAsHtml(split.join(' '));
    };
}]);
onegreek.service('authService', ["$http", "$cordovaFacebook", "urlFactory", "universityService", "organizationService", function($http, $cordovaFacebook, urlFactory, universityService, organizationService) {
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
                console.log('Login response', response.data);
                var data = response.data;
                authService.setUser(data.user);
                return response;
            });
        },

        logout:function() {
            onegreekConfig.user_uuid = null;
            this.setUser(null);
            $cordovaFacebook.logout();
        }
    };
    return authService;
}]);
onegreek.service('chapterService', ["$http", "urlFactory", function($http, urlFactory) {
    return {
        getChapters:function(universityId) {
            var url = urlFactory.apiUrl('university/chapters/'+universityId);
            return $http.get(url);
        }
    }
}]);
onegreek.service('deviceMediaService', ["$q", function($q) {
   return {
       takePicture:function(cameraOptions) {
           console.log('Take Pic');
           var q = $q.defer();
            navigator.camera.getPicture(function(imageURI) {
                q.resolve({imageURI : imageURI});
            }, function(err) {
                q.reject(err);
            }, cameraOptions);

           return q.promise;
       },
       choosePicture: function(options) {
           console.log('Choose Pic');
           var q = $q.defer();
           navigator.camera.getPicture(function(result) {
               q.resolve(result);
           }, function(err) {
               q.reject(err);
           }, options);

           return q.promise;
       }
    }
}]);
onegreek.service('newsfeedService', ["$http", "urlFactory", function($http, urlFactory) {
    return {
        getRecent: function() {
            return $http.get(urlFactory.apiUrl('newsfeed/posts'));
        },
        getTrending: function() {
            return $http.get(urlFactory.apiUrl('newsfeed/trending'));
        }
    }
}])
onegreek.service('organizationService', ["$http", "urlFactory", function($http, urlFactory) {
    return {
        organizations: null,
        setOrganizations:function(organizations) {
            this.organizations = organizations;
        },
        getOrganization:function(id) {
            if(this.organizations) {
                for(var i in this.organizations) {
                    if(this.organizations[i].id == id) {
                        return this.organizations[i];
                    }
                }
            }
            return null;
        }
    }
}]);
onegreek.service('universityService', ["$http", "urlFactory", function($http, urlFactory) {
    return {
        universities: null,
        setUniversities:function(universities) {
            this.universities = universities;
        },
        getUniversity:function(id) {
            if(this.universities) {
                for(var i in this.universities) {
                    if(this.universities[i].id == id) {
                        return this.universities[i];
                    }
                }
            }
            return null;
        }
    }
}]);
onegreek.service('userService', ["$http", "urlFactory", function($http, urlFactory) {
    return {
        /**
         *
         * @param user
         * @returns {HttpPromise}
         */
        register: function(user) {
            var url = urlFactory.apiUrl('register/user');
            return $http.post(url, user);
        }
    };
}]);