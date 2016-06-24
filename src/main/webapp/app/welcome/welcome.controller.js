(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$scope', '$state', 'Home'];

    function WelcomeController ($scope, $state, Home) {
        angular.element(document).ready(function() {
            angular.element($(".slider")).first().css("height", "400px");
        });

        var vm = this;
        vm.loadSlider = false;

        vm.entries = Home.query({nb: 4}, function(){
            vm.loadSlider = true;
            console.log(vm.entries);
        })
    }
})();
