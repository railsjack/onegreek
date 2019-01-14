onegreek.directive('valignElement', function($window){
    // vertical center element on page
    return function(scope, element){
        var pixels;
        var w = angular.element($window);
        function setPixels(){
            var h = $window.innerHeight;
            var eh = element[0].clientHeight*1.1;
            pixels = (h - eh)/2 - 30;
            if (pixels < 50) {
                pixels = 50 + 'px';
            } else {
                pixels = pixels + 'px';
            }
            element.css('margin-top', pixels);
        }
        setPixels();
        w.bind('resize', function(){
            setPixels();
        });
    }
});