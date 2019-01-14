onegreek.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

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
});
