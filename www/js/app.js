var onegreek = angular.module('onegreek', [
    'ui.router',
    'ionic',
    'ngCordova',
    'ngCordova.plugins.instagram'
]);
onegreek.run(["$rootScope", "$ionicPlatform", "$http", "$cordovaStatusbar", "authService", function($rootScope, $ionicPlatform, $http, $cordovaStatusbar, authService) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
        console.log(e.target);
    });

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
        .state('register.phone', {
            url: '/register/phone',
            templateUrl: 'views/pages/register/phone.html',
            controller: 'registerController'
        })
        .state('register.email', {
            url: '/register/email',
            templateUrl: 'views/pages/register/email.html',
            controller: 'registerController'
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
            url: '/compose',
            templateUrl: 'views/pages/app/newsfeed/compose.html',
            controller: 'newsfeedComposeController'
        })
        .state('app.roster', {
            url: '/roster',
            templateUrl: 'views/pages/app/roster.html',
            controller: 'rosterController'
        })
        .state('app.invite', {
            url: '/invite',
            templateUrl: 'views/pages/app/invite.html',
            controller: 'inviteController'
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
                universityService.setUniversities(data.universities);
                organizationService.setOrganizations(data.organizations);
                attemptLogin();
            });
    };

    var attemptLogin = function() {
//        $cordovaFacebook.logout();
        $cordovaFacebook.getLoginStatus()
            .then(function(success) {
                if(success.status == 'unknown') {
                    $state.go('login');
                } else {
                    var authResponse = success.authResponse;
                    authService.loginByFacebook(authResponse.userID, authResponse.accessToken)
                        .then(function(response) {
                            if(authService.userIsRegistered()) {
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
                if(false && authService.userIsRegistered()) {
                    $scope.isWorking = false;
                    $state.go('app.newsfeed.recent');
                } else {
                    $scope.isWorking = false;
                    $state.go('register.phone');
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
                console.log(error);
                $scope.error = 'An error occurred.';
            });
    };

}]);
onegreek.controller('newsfeedComposeController', ["$scope", "$state", "$cordovaInstagram", "$cordovaFacebook", "$ionicActionSheet", "$window", "authService", "newsfeedService", "deviceMediaService", function($scope, $state, $cordovaInstagram, $cordovaFacebook, $ionicActionSheet, $window, authService, newsfeedService, deviceMediaService) {

    if( !authService.isLoggedIn() ) {
        $state.go('boot');
    };

    $scope.draftPost = {
        text: '',
        photos: [],
        share_to_facebook: false,
        share_to_instagram: false
    };

    $scope.currentUser = authService.getUser();

    $scope.toggleFacebook = function() {
        $scope.draftPost.share_to_facebook = !$scope.draftPost.share_to_facebook;
    };

    $scope.toggleInstagram = function() {
        $scope.draftPost.share_to_instagram = !$scope.draftPost.share_to_instagram;
    };

    $scope.togglePhoto = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Take New Photo' },
                { text: 'Choose Existing Photo' }
            ],
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                switch(index) {
                    case 0:
                        $scope.takePhoto();
                        break;
                    case 1:
                        $scope.choosePhoto();
                        break;
                }
                return true;
            }
        });
    };

    $scope.takePhoto = function() {
        deviceMediaService.takePicture().then(function (result) {
            $scope.draftPost.photos.push({ data: result.dataURL});
        });
    };

    $scope.choosePhoto = function() {
        deviceMediaService.choosePicture().then(function (result) {
            $scope.draftPost.photos.push({ data: result.dataURL});
        });
    };

    $scope.removePhoto = function() {
        $scope.draftPost.photos = [];
    };

    $scope.submitPost = function() {
        $scope.isLoading = true;
        newsfeedService.create($scope.draftPost).then(function(response) {

            $scope.post = response.data;
            console.log('New Post', $scope.post);

            if($scope.post.share_to_facebook) {
                authService.canUserPostToFacebook()
                    .success(function() {
                        newsfeedService.sharePostToFacebook($scope.post);
                    })
                    .error(function() {
                        if(confirm('We need to get permission from Facebook to post. Continue?')) {
                            $cordovaFacebook.login(['post_actions'])
                                .then(function(response) {
                                    newsfeedService.sharePostToFacebook($scope.post);
                                });
                        }
                    })
            }

            if($scope.post.share_to_instagram && $scope.post.photos.length > 0) {
                newsfeedService.sharePostToInstagram($scope.post,  $scope.post.photos[0].data).then(function() {
                    $state.go('app.newsfeed.recent');
                }, function(err) {
                    console.log('Instagram Error:', err);
                    alert('You wanted to share this on Instagram, but there was an error opening the application. Please ensure you have Instagram installed.');
                });
            }

            $state.go('app.newsfeed.recent');

        });
    };

    $scope.cancelPost = function() {
        $state.go('app.newsfeed.recent');
    };

}]);
onegreek.controller('newsfeedController', ["$scope", "$rootScope", "$state", "authService", "newsfeedService", function($scope, $rootScope, $state, authService, newsfeedService) {

    if( !authService.isLoggedIn() ) {
        $state.go('boot');
    };


    $scope.posts = [];
    $scope.isLoading = false;
    $scope.draftComment = null;
    $scope.currentUser = authService.getUser();

    $scope.refresh = function() {
        $scope.postsOffsetStart = 0;
        $scope.postsOffsetEnd = 9;
        $scope.postsSize = 10
        $scope.init();
    }

    $scope.init = function() {
        if($state.$current.name == 'app.newsfeed.recent') {
            $scope.loadRecentPosts();
        } else if($state.$current.name == 'app.newsfeed.trending') {
            $scope.loadTrendingPosts();
        } else {
            alert('Error!');
        }
    };

    $scope.loadRecentPosts = function() {
        $scope.isLoading = true;
        newsfeedService.getRecent().then(function(response) {
            $scope.isLoading = false;
            for(var key in response.data) {
                $scope.posts.push(response.data[key]);
            }
        });
    };

    $scope.loadTrendingPosts = function() {
        $scope.isLoading = true;
        newsfeedService.getTrending().then(function(response) {
            $scope.isLoading = false;
            for(var key in response.data) {
                $scope.posts.push(response.data[key]);
            }
        });
    };

    $scope.composeComment = function(post) {
        $scope.draftComment = {
            text: '',
            post: post
        };
    };

    $scope.replacePost = function(post) {
        for(var key in $scope.posts) {
            if($scope.posts[key].id == post.id) {
                $scope.posts[key] = post;
                break;
            }
        };
    };
    $scope.postComment = function() {
        if(!$scope.draftComment.text || $scope.draftComment.text.length < 1) {
            alert('Please enter a comment.');
            return;
        }
        $scope.commentIsPosting = true;
        newsfeedService.commentOnPost($scope.draftComment.text, $scope.draftComment.post).then(function(response) {
            var post = response.data;
            post.showComments = true;
            $scope.replacePost(post);
            $scope.cancelComment();
        })
    }
    $scope.cancelComment = function() {
        $scope.commentIsPosting = false;
        $scope.draftComment = null;
    }

    $scope.init();
}]);
onegreek.controller('registerController', ["$scope", "$state", "authService", "userService", "universityService", "organizationService", function($scope, $state, authService, userService, universityService, organizationService) {

    if( !authService.isLoggedIn() ) {
        $state.go('boot');
    };

    // Scope values
    $scope.user = authService.user;
    $scope.universities = universityService.universities;
    $scope.organizations = universityService.organizations;
    $scope.canContinue = false;
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

    $scope.submitPhone = function() {
        userService.save($scope.user);
        $state.go('register.email');
    };

    $scope.submitEmail = function() {
        userService.save($scope.user);
        $state.go('register.organization');
    }

    $scope.updateOrganizations = function() {
        $scope.organizations = $scope.filterList(organizationService.organizations, $scope.filters.organization_name);
    };

    $scope.selectOrganization = function(organization) {
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

    $scope.updateOrganizations();



}]);
onegreek.controller('rosterController', ["$scope", "$state", function($scope, $state) {

}]);
onegreek.controller('settingsController', ["$scope", "$state", "authService", function($scope, $state, authService) {

    $scope.logout = function() {
        authService.logout();
        $state.go('boot');
    }

}]);
onegreek.service('authService', ["$http", "$q", "$cordovaFacebook", "urlFactory", "universityService", "organizationService", function($http, $q, $cordovaFacebook, urlFactory, universityService, organizationService) {
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
       takePicture:function() {
           var options = {
               quality: 50,
               destinationType: navigator.camera.DestinationType.DATA_URL,
               sourceType: navigator.camera.PictureSourceType.CAMERA
           };
           var q = $q.defer();
            navigator.camera.getPicture(function(dataURL) {
                q.resolve({ dataURL: dataURL });
            }, function(err) {
                q.reject(err);
            }, options);
           return q.promise;
       },
       choosePicture: function() {
           var options = {
               quality: 50,
               destinationType: navigator.camera.DestinationType.DATA_URL,
               sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
           };
           var q = $q.defer();
           navigator.camera.getPicture(function(dataURL) {
               q.resolve({ dataURL: dataURL });
           }, function(err) {
               q.reject(err);
           }, options);
           return q.promise;
       }
    }
}]);
onegreek.service('newsfeedService', ["$http", "urlFactory", "$cordovaInstagram", function($http, urlFactory, $cordovaInstagram) {
    return {
        getRecent: function(offsetStart, offsetEnd) {
            return $http.get(urlFactory.apiUrl('newsfeed/recent', { offset_start: offsetStart, offset_end: offsetEnd}));
        },
        getTrending: function(offsetStart, offsetEnd) {
            return $http.get(urlFactory.apiUrl('newsfeed/trending', { offset_start: offsetStart, offset_end: offsetEnd}));
        },
        create:function(post) {
            return $http.post(urlFactory.apiUrl('newsfeed/post'), post);
        },
        upvotePost:function(post) {
            return $http.post(urlFactory.apiUrl('post/upvote'), { post_id: post.id });
        },
        downvotePost:function(post) {
            return $http.post(urlFactory.apiUrl('post/downvote'), { post_id: post.id });
        },
        commentOnPost: function(text, post) {
            return $http.post(urlFactory.apiUrl('post/comment'), {
                post_id: post.id,
                text: text
            });
        },
        getComments:function(post, offset) {
            return $http.get(urlFactory.apiUrl('post/comments', { post_id: post.id, offset: offset }));
        },
        sharePostToFacebook: function(post) {
            return $http.post(urlFactory.apiUrl('facebook/repost'), {post_id: post.id});
        },
        sharePostToInstagram: function(post, imageData) {
            var instagramData = {
                image: 'data:image/jpeg;base64,'+imageData,
                caption: post.text
            };
            return $cordovaInstagram.share(instagramData);
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
}]);
onegreek.directive('ogFocusOnLoad', function() {
    return function(scope, elm, attr) {
       $(elm).focus();
    };

});
onegreek.directive('ogNewsfeedPost', function() {
    return {
        scope: {
            post: '=',
            draftComment: '='
        },
        controller: ["$scope", "$rootScope", "authService", "newsfeedService", function($scope, $rootScope, authService, newsfeedService) {
            $scope.currentUser = authService.user;
            $scope.draftComment = $scope.$parent.draftComment;
            $scope.isLoadingComments = false;

            $scope.$on('hide_all_comments', function() {
                $scope.post.showComments = false;
                $scope.$parent.cancelComment();
            });

            $scope.upvote = function() {
                newsfeedService.upvotePost($scope.post).then(function(response) {
                    $scope.post = response.data;
                });
            };

            $scope.downvote = function() {
                newsfeedService.downvotePost($scope.post).then(function(response) {
                    $scope.post = response.data;
                });
            };

            $scope.toggleComments = function() {
                if(!$scope.post.showComments) {
                    $rootScope.$broadcast('hide_all_comments');
                }
                $scope.post.showComments = !$scope.post.showComments;
                if($scope.post.comments.length == 0) {
                    $scope.composeComment($scope.post);
                }
            };

            $scope.composeComment = function(post) {
                $scope.$parent.composeComment(post);
            };

            $scope.loadMoreComments = function(post) {
                newsfeedService.getPostComments(post, post.comments.length)
                    .then(function(response) {
                        for(var i in response.data) {
                            post.comments.push(response.data[i]);
                        }
                    });
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
onegreek.filter('authorByline', ["$sce", function($sce) {
    return function(thing) {
        var html = '';
        if(thing.brand) {
            html = '<span class="name">'+thing.brand.name+'</span>';
        } else {
            if(thing.user) {
                user = thing.user;
            } else {
                user = thing;
            }

            if(user) {
                var name = user.first_name;
                var symbol = user.organization ? user.organization.symbol : '';
                var uni = user.university ? user.university.name : '';
            } else {
                var name = 'Unknown';
                var symbol = '';
                var uni = '';
            }
            html = '<span class="name">'+name+' '+symbol+'</span>';
            html += '<span class="university">'+uni+'</span>';

        }
        return $sce.trustAsHtml(html);
    };
}]);
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
       apiUrl: function(partial, params) {
           return onegreekConfig.onegreekApiEndpoint + partial + '?' + this.queryString(params);
       },
       bootUrl: function() {
           return onegreekConfig.onegreekApiEndpoint.replace('api/', 'boot.json');
       },
       queryString: function(params) {
           var queryString = '';
           for(var key in params) {
               if(key) {
                   queryString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
               }
           }
           return queryString;
       }
   }
});