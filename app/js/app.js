var onegreek = angular.module('onegreek', [
    'ui.router',
    'ionic',
    'ngCordova',
    'ngCordova.plugins.instagram'
]);
onegreek.run(function($rootScope, $ionicPlatform, $http, $cordovaStatusbar, authService) {

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

});
