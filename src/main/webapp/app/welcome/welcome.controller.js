(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$scope', '$state', 'LastEntries'];

    function WelcomeController ($scope, $state, LastEntries) {
        angular.element(document).ready(function() {
            angular.element($(".slider")).first().css("height", "400px");
        });

        var vm = this;
        vm.loadSlider = false;

        vm.entries = LastEntries.query(function(){
            vm.loadSlider = true;
            console.log(vm.entries);
        })
    }
})();
