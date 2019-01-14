onegreek.service('organizationService', function($http, urlFactory) {
    return {
        organizations: null,
        setOrganizations:function(organizations) {
            this.organizations = organizations;
        },
        getOrganization:function(id) {
            if(this.organizations) {
                for(var i in this.organizations) {
                    if(this.organizations[i].id == id) {
                        return this.organizations[i];
                    }
                }
            }
            return null;
        }
    }
});