onegreek.filter('authorByline', function($sce) {
    return function(thing) {
        var html = '';
        if(thing.brand) {
            html = '<span class="name">'+thing.brand.name+'</span>';
        } else {
            if(thing.user) {
                user = thing.user;
            } else {
                user = thing;
            }

            if(user) {
                var name = user.first_name;
                var symbol = user.organization ? user.organization.symbol : '';
                var uni = user.university ? user.university.name : '';
            } else {
                var name = 'Unknown';
                var symbol = '';
                var uni = '';
            }
            html = '<span class="name">'+name+' '+symbol+'</span>';
            html += '<span class="university">'+uni+'</span>';

        }
        return $sce.trustAsHtml(html);
    };
});