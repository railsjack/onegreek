onegreek.controller('chapterListController', function($scope, $state, authService, chapterService, $state) {

    if(!authService.isLoggedIn()) {
        $state.go('boot');
    }

    $scope.chapters = null;

    chapterService.getChapters(authService.getUser().university_id)
        .then(function(response) {
            $scope.chapters = response.data;
        });

});