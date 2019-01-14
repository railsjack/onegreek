onegreek.directive('ogNewsfeedPost', function() {
    return {
        scope: {
            post: '=',
            draftComment: '='
        },
        controller: function($scope, $rootScope, authService, newsfeedService) {
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
        },
        templateUrl: 'views/partials/og-newsfeed-post.html'
    }
});