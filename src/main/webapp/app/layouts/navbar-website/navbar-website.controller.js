(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('NavbarWebsiteController', NavbarWebsiteController);

    NavbarWebsiteController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function NavbarWebsiteController ($state, Auth, Principal, ProfileService, LoginService) {

        angular.element(document).ready(function() {
            angular.element($(".button-collapse")).first().sideNav();
        });

        var vm = this;

        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;

        ProfileService.getProfileInfo().then(function(response) {
            vm.inProduction = response.inProduction;
            vm.swaggerDisabled = response.swaggerDisabled;
        });

        vm.login = login;
        vm.logout = logout;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;

        function login() {
            collapseNavbar();
            LoginService.open();
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }
    }
})();
