onegreek.controller('settingsController', function($scope, $state, authService) {

    $scope.logout = function() {
        authService.logout();
        $state.go('boot');
    }

});