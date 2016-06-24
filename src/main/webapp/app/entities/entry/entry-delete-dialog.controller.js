(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('EntryDeleteController',EntryDeleteController);

    EntryDeleteController.$inject = ['$uibModalInstance', 'entity', 'Entry'];

    function EntryDeleteController($uibModalInstance, entity, Entry) {
        var vm = this;
        vm.entry = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Entry.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
