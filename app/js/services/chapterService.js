onegreek.service('chapterService', function($http, urlFactory) {
    return {
        getChapters:function(universityId) {
            var url = urlFactory.apiUrl('university/chapters/'+universityId);
            return $http.get(url);
        }
    }
});