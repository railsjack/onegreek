onegreek.filter('hashtagParser', function($sce) {
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
});