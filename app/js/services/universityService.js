onegreek.service('universityService', function($http, urlFactory) {
    return {
        universities: null,
        setUniversities:function(universities) {
            this.universities = universities;
        },
        getUniversity:function(id) {
            if(this.universities) {
                for(var i in this.universities) {
                    if(this.universities[i].id == id) {
                        return this.universities[i];
                    }
                }
            }
            return null;
        }
    }
});