onegreek.controller('registerController', function($scope, $state, authService, userService, universityService, organizationService) {

    if( !authService.isLoggedIn() ) {
        $state.go('boot');
    };

    // Scope values
    $scope.user = authService.user;
    $scope.universities = universityService.universities;
    $scope.organizations = universityService.organizations;
    $scope.canContinue = false;
    $scope.filters = {
        university_name: '',
        organization_name: ''
    };

    $scope.filterList = function(list, search) {
        var filtered = [];
        if(search) {
            for(key in list) {
                if(list[key].name && list[key].name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    filtered.push(list[key]);
                }
            }
        } else {
            filtered = list;
        }
        return filtered;
    };

    $scope.submitPhone = function() {
        userService.save($scope.user);
        $state.go('register.email');
    };

    $scope.submitEmail = function() {
        userService.save($scope.user);
        $state.go('register.organization');
    }

    $scope.updateOrganizations = function() {
        $scope.organizations = $scope.filterList(organizationService.organizations, $scope.filters.organization_name);
    };

    $scope.selectOrganization = function(organization) {
        $state.go('register.email');
    };

    $scope.submitRegistration = function() {

        var endsWith = function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var validateEmail = function(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2,66})?)$/i;
            var valid = re.test(email);
            if(valid) {
                return endsWith(email, '.edu');
            } else {
                return false;
            }
        }

        if(validateEmail(authService.user.university_email)) {
            $scope.isLoading = true;
            userService.register(authService.user)
                .then(function(response) {
                    $scope.isLoading = false;
                    $scope.isSubmitted = true;
                    authService.setUser(response.data.user);
                });
        } else {
            alert('Please enter a valid .edu email.');
        }

    };

    $scope.updateOrganizations();



});