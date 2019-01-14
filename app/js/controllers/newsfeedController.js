onegreek.controller('newsfeedController', function($scope, $rootScope, $state, authService, newsfeedService) {

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
});