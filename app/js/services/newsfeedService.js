onegreek.service('newsfeedService', function($http, urlFactory, $cordovaInstagram) {
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
})