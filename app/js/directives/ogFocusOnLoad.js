onegreek.directive('ogFocusOnLoad', function() {
    return function(scope, elm, attr) {
       $(elm).focus();
    };

});