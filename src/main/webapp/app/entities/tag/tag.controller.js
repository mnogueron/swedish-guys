(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('TagController', TagController);

    TagController.$inject = ['$scope', '$state', 'Tag'];

    function TagController ($scope, $state, Tag) {
        var vm = this;
        vm.tags = [];
        vm.loadAll = function() {
            Tag.query(function(result) {
                vm.tags = result;
            });
        };

        vm.loadAll();
        
    }
})();
