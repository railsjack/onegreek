onegreek.controller('loginController', function($scope, $state, $cordovaFacebook, authService) {

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

});