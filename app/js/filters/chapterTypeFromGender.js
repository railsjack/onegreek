onegreek.filter('chapterTypeFromGender', function() {
    return function(input) {
        return input == 'male' ? 'Fraterntiy' : 'Sorority';
    };
});