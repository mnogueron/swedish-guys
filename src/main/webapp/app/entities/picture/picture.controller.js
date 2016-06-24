(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('PictureController', PictureController);

    PictureController.$inject = ['$scope', '$state', 'Picture'];

    function PictureController ($scope, $state, Picture) {
        var vm = this;
        vm.pictures = [];
        vm.loadAll = function() {
            Picture.query(function(result) {
                vm.pictures = result;
            });
        };

        vm.loadAll();
        
    }
})();
