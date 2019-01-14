onegreek.controller('newsfeedComposeController', function($scope, $state, $cordovaInstagram, $cordovaFacebook, $ionicActionSheet, $window, authService, newsfeedService, deviceMediaService) {

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

});